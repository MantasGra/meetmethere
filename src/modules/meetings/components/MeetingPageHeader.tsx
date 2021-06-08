import React, { useEffect } from 'react';
import format from 'date-fns/format';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import PlacesAutocomplete, { IValue } from 'src/components/PlacesAutocomplete';
import MeetingStatusChip, {
  MeetingStatusDisplayNames,
} from './MeetingStatusChip';
import getDirectionsURL from 'src/utils/getDirectionsURL';
import openInNewTab from 'src/utils/openInNewTab';
import AccountAvatar from 'src/modules/auth/components/AccountAvatar';
import { useForm, Controller } from 'react-hook-form';
import {
  meetingsMeetingPollDialogVisibleChangeRequest,
  meetingsChangeParticipantStatusProposal,
  meetingsUpdateMeetingRequest,
  meetingsEditModeChange,
} from '../actions';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import {
  invitationMeetingByIdSelector,
  meetingsIsEditMode,
  meetingsIsUserCreator,
  meetingsMeetingByIdSelector,
} from '../selectors';
import { ParticipationStatus } from 'src/modules/invitations/reducer';
import { accountEmailSelector } from 'src/modules/auth/selectors';
import { invitationsInviteUserDialogOpenRequest } from 'src/modules/invitations/actions';
import { MeetingStatus } from '../reducer';
import { omit } from 'lodash';
import { DateTimePicker } from '@material-ui/pickers';
import { differenceInMinutes, isAfter, min } from 'date-fns';
import classes from './MeetingPageHeader.module.scss';

interface IProps {
  id: number;
}

interface IMeetingEditForm {
  name: string;
  meetingStatus: MeetingStatus;
  description: string;
  location: IValue;
  startDate: Date;
  endDate: Date;
}

const MeetingPageHeader: React.FC<IProps> = (props) => {
  const dispatch = useAppDispatch();

  const meeting = useAppSelector((state) =>
    meetingsMeetingByIdSelector(state, props.id),
  );

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<IMeetingEditForm>();

  const invitation = useAppSelector((state) =>
    invitationMeetingByIdSelector(state, props.id),
  );
  const currentUserEmail = useAppSelector((state) =>
    accountEmailSelector(state),
  );

  const formStartDate = watch('startDate', new Date());

  const isEditMode = useAppSelector((state) =>
    meetingsIsEditMode(state, props.id),
  );

  const onEditSubmit = (formData: IMeetingEditForm) => {
    console.log('formData', formData);
    dispatch(
      meetingsUpdateMeetingRequest(meeting.id, {
        name: formData.name,
        description: formData.description,
        ...(formData.location.input !== meeting.locationString
          ? {
              locationId: formData.location.place
                ? formData.location.place.place_id
                : null,
              locationString: !formData.location.place
                ? formData.location.input
                : null,
            }
          : {}),
        status: formData.meetingStatus,
        startDate: meeting.isDatesPollActive
          ? null
          : formData.startDate.toISOString(),
        endDate: meeting.isDatesPollActive
          ? null
          : formData.endDate.toISOString(),
      }),
    );
  };

  useEffect(() => {
    if (isEditMode) {
      reset({
        meetingStatus: meeting.status,
        name: meeting.name,
        description: meeting.description,
        location: { input: meeting.locationString || '', place: null },
        startDate: new Date(meeting.startDate),
        endDate: new Date(meeting.endDate),
      });
    }
  }, [isEditMode]);

  const onGetDirectionsClick = () => {
    if (meeting.locationString) {
      openInNewTab(
        getDirectionsURL(
          meeting.locationString,
          meeting.locationId ? meeting.locationId : undefined,
        ),
      );
    }
  };

  const onMeetingPollOpenClick = () => {
    dispatch(meetingsMeetingPollDialogVisibleChangeRequest(props.id));
  };

  const onInviteClick = () => {
    dispatch(invitationsInviteUserDialogOpenRequest(props.id));
  };
  const onStatusChange = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>,
  ) => {
    dispatch(
      meetingsChangeParticipantStatusProposal({
        status: e.target.value as ParticipationStatus,
        id: meeting.id,
        userEmail: currentUserEmail,
      }),
    );
  };

  const isCreatorUser = useAppSelector((state) =>
    meetingsIsUserCreator(state, props.id),
  );

  const isHistoricMeeting = [
    MeetingStatus.Ended,
    MeetingStatus.Canceled,
  ].includes(meeting.status);

  const onEditModeClick = () => {
    dispatch(meetingsEditModeChange(props.id));
  };

  return (
    <div className={classes.meetingPageHeader}>
      {isCreatorUser && !isHistoricMeeting ? (
        <Fab
          color="primary"
          className={classes.meetingEditButton}
          onClick={isEditMode ? handleSubmit(onEditSubmit) : onEditModeClick}
        >
          {isEditMode ? <SaveIcon /> : <EditIcon />}
        </Fab>
      ) : null}
      <div className={classes.meetingTitleRow}>
        <div className={classes.meetingTitle}>
          {!isEditMode ? (
            <>
              <Typography variant="h4" className={classes.meetingTitleText}>
                {meeting.name}
              </Typography>
              <MeetingStatusChip meetingStatus={meeting.status} />
            </>
          ) : (
            <>
              <TextField
                inputProps={{
                  ...register('name', {
                    required: 'Required',
                  }),
                }}
                label="Name"
                variant="filled"
                defaultValue={meeting.name}
              />
              <FormControl
                variant="filled"
                className={classes.meetingStatusSelect}
              >
                <InputLabel id="meetingStatusLabel">Meeting Status</InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      {...omit(field, 'value', 'onChange', 'ref')}
                      labelId="meetingStatusLabel"
                      value={field.value}
                      onChange={(
                        event: React.ChangeEvent<{ value: unknown }>,
                      ) => field.onChange(event.target.value)}
                    >
                      <MenuItem value={MeetingStatus.Planned}>
                        {MeetingStatusDisplayNames[MeetingStatus.Planned]}
                      </MenuItem>
                      <MenuItem value={MeetingStatus.Started}>
                        {MeetingStatusDisplayNames[MeetingStatus.Started]}
                      </MenuItem>
                      <MenuItem value={MeetingStatus.Ended}>
                        {MeetingStatusDisplayNames[MeetingStatus.Ended]}
                      </MenuItem>
                      <MenuItem value={MeetingStatus.Postponed}>
                        {MeetingStatusDisplayNames[MeetingStatus.Postponed]}
                      </MenuItem>
                      <MenuItem value={MeetingStatus.Canceled}>
                        {MeetingStatusDisplayNames[MeetingStatus.Canceled]}
                      </MenuItem>
                      <MenuItem value={MeetingStatus.Extended}>
                        {MeetingStatusDisplayNames[MeetingStatus.Extended]}
                      </MenuItem>
                    </Select>
                  )}
                  name="meetingStatus"
                  control={control}
                  defaultValue={meeting.status}
                />
              </FormControl>
            </>
          )}
        </div>
        <div className={classes.userParticipationStatus}>
          <FormControl
            variant="outlined"
            className={classes.statusSelect}
            size="small"
            disabled={isHistoricMeeting}
          >
            <InputLabel id="demo-simple-select-outlined-label">
              Status
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              label="Status"
              value={invitation.userParticipationStatus}
              onChange={onStatusChange}
            >
              {invitation.userParticipationStatus ===
              ParticipationStatus.Invited ? (
                <MenuItem value="invited">
                  <em>Invited</em>
                </MenuItem>
              ) : null}
              <MenuItem value={ParticipationStatus.Going}>Going</MenuItem>
              <MenuItem value={ParticipationStatus.Maybe}>Maybe</MenuItem>
              <MenuItem value={ParticipationStatus.Declined}>Declined</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <div>
        {!isEditMode ? (
          <Typography
            variant="body2"
            color="textSecondary"
            className={classes.meetingDescription}
          >
            {meeting.description}
          </Typography>
        ) : (
          <TextField
            inputProps={{ ...register('description'), maxLength: 255 }}
            className={classes.meetingDescriptionInput}
            multiline
            label="Description"
            rows={4}
            fullWidth
            defaultValue={meeting.description}
            variant="filled"
          />
        )}
      </div>
      <div className={classes.meetingInfoRow}>
        <div>
          {meeting.isDatesPollActive ? (
            <Button
              color="primary"
              variant="outlined"
              onClick={onMeetingPollOpenClick}
            >
              Open Dates Poll
            </Button>
          ) : !isEditMode ? (
            <>
              <div className={classes.meetingDateEntry}>
                <Typography variant="subtitle2">From:</Typography>
                <Typography variant="subtitle2">
                  {format(new Date(meeting.startDate), 'yyyy-MM-dd HH:mm')}
                </Typography>
              </div>
              <div className={classes.meetingDateEntry}>
                <Typography variant="subtitle2">To:</Typography>
                <Typography variant="subtitle2">
                  {format(new Date(meeting.endDate), 'yyyy-MM-dd HH:mm')}
                </Typography>
              </div>
            </>
          ) : (
            <div className={classes.meetingDateInputs}>
              <Controller
                render={({ field }) => (
                  <DateTimePicker
                    {...omit(field, 'ref')}
                    label="Start Date"
                    margin="dense"
                    minDate={min([new Date(), meeting.startDate])}
                    inputVariant="filled"
                  />
                )}
                name="startDate"
                control={control}
                defaultValue={new Date()}
              />
              <Controller
                render={({ field }) => (
                  <DateTimePicker
                    {...omit(field, 'ref')}
                    helperText={
                      errors.endDate?.type === 'validate'
                        ? 'End date must be after start date'
                        : undefined
                    }
                    error={!!errors.endDate}
                    margin="dense"
                    label="End Date"
                    minDate={min([new Date(), meeting.endDate])}
                    inputVariant="filled"
                  />
                )}
                name="endDate"
                control={control}
                rules={{
                  validate: (value) => {
                    console.log(value, formStartDate);
                    return (
                      isAfter(value, formStartDate) &&
                      differenceInMinutes(value, formStartDate) > 0
                    );
                  },
                }}
                defaultValue={new Date()}
              />
            </div>
          )}
        </div>
        <div className={classes.meetingLocation}>
          {!isEditMode ? (
            <>
              <Typography
                className={classes.meetingLocationText}
                variant="subtitle2"
              >{`Location: ${meeting.locationString}`}</Typography>
              <Button
                onClick={onGetDirectionsClick}
                size="small"
                color="primary"
              >
                Get Directions
              </Button>
            </>
          ) : (
            <Controller
              render={({ field }) => {
                return (
                  <PlacesAutocomplete
                    {...omit(field, 'value', 'onChange', 'ref')}
                    realValue={field.value}
                    onRealValueChange={(newLocation) =>
                      field.onChange(newLocation)
                    }
                    variant="filled"
                    className={classes.meetingPlaceSelect}
                  />
                );
              }}
              name="location"
              control={control}
              defaultValue={{
                input: meeting.locationString,
                place: null,
              }}
            />
          )}
        </div>
      </div>
      <div className={classes.meetingMemberList}>
        <Typography variant="subtitle2">Members:</Typography>
        {meeting.participants.map((participant) => (
          <AccountAvatar
            key={participant.id}
            initials={`${participant.name.charAt(
              0,
            )}${participant.lastName.charAt(0)}`}
            color={participant.color}
            className={classes.memberListAvatar}
          />
        ))}
        <Button color="primary" onClick={onInviteClick}>
          View all
        </Button>
      </div>
    </div>
  );
};

export default MeetingPageHeader;

import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DateTimePicker from '@mui/lab/DateTimePicker';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { differenceInMinutes, isAfter, min } from 'date-fns';
import format from 'date-fns/format';
import { omit } from 'lodash';
import { useEffect, useMemo, Fragment } from 'react';
import { useForm, Controller } from 'react-hook-form';
import PlacesAutocomplete, { IValue } from 'src/components/PlacesAutocomplete';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import AccountAvatar from 'src/modules/auth/components/AccountAvatar';
import { authCurrentUserIdSelector } from 'src/modules/auth/selectors';
import { invitationsInviteUserDialogOpenRequest } from 'src/modules/invitations/actions';
import { ParticipationStatus } from 'src/modules/invitations/reducer';
import getDirectionsURL from 'src/utils/getDirectionsURL';
import openInNewTab from 'src/utils/openInNewTab';
import { toDate } from 'src/utils/transformators';

import {
  meetingsMeetingPollDialogVisibleChangeRequest,
  meetingsChangeParticipantStatusProposal,
  meetingsUpdateMeetingRequest,
  meetingsEditModeChange,
} from '../actions';
import { MeetingStatus } from '../reducer';
import {
  meetingsCurrentUserAsMeetingParticipantSelector,
  meetingsIsEditMode,
  meetingsIsUserCreator,
  meetingsMeetingByIdSelector,
} from '../selectors';

import classes from './MeetingPageHeader.styles';
import MeetingStatusChip, {
  MeetingStatusDisplayNames,
} from './MeetingStatusChip';

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

  const startDate = useMemo(() => toDate(meeting.startDate), [meeting]);
  const endDate = useMemo(() => toDate(meeting.endDate), [meeting]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<IMeetingEditForm>();

  const participant = useAppSelector((state) =>
    meetingsCurrentUserAsMeetingParticipantSelector(state, props.id),
  );
  const currentUserId = useAppSelector(authCurrentUserIdSelector);

  const formStartDate = watch('startDate', new Date());

  const isEditMode = useAppSelector((state) =>
    meetingsIsEditMode(state, props.id),
  );

  const onEditSubmit = (formData: IMeetingEditForm) => {
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
        startDate,
        endDate,
      });
    }
  }, [isEditMode, meeting, startDate, endDate, reset]);

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
  const onStatusChange = (e: SelectChangeEvent<ParticipationStatus>) => {
    if (currentUserId) {
      dispatch(
        meetingsChangeParticipantStatusProposal(
          meeting.id,
          currentUserId,
          e.target.value as ParticipationStatus,
        ),
      );
    }
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
    <div css={classes.meetingPageHeader}>
      {isCreatorUser && !isHistoricMeeting ? (
        <Fab
          color="primary"
          css={classes.meetingEditButton}
          onClick={isEditMode ? handleSubmit(onEditSubmit) : onEditModeClick}
        >
          {isEditMode ? <SaveIcon /> : <EditIcon />}
        </Fab>
      ) : null}
      <div css={classes.meetingTitleRow}>
        <div css={classes.meetingTitle}>
          {!isEditMode ? (
            <Fragment>
              <Typography variant="h4" css={classes.meetingTitleText}>
                {meeting.name}
              </Typography>
              <MeetingStatusChip meetingStatus={meeting.status} />
            </Fragment>
          ) : (
            <Fragment>
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
              <FormControl variant="filled" css={classes.meetingStatusSelect}>
                <InputLabel id="meetingStatusLabel">Meeting Status</InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      {...omit(field, 'value', 'onChange', 'ref')}
                      labelId="meetingStatusLabel"
                      value={field.value}
                      onChange={(event) => field.onChange(event.target.value)}
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
            </Fragment>
          )}
        </div>
        <div css={classes.userParticipationStatus}>
          {participant && (
            <FormControl
              variant="outlined"
              css={classes.statusSelect}
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
                value={participant.userParticipationStatus}
                onChange={onStatusChange}
              >
                {participant.userParticipationStatus ===
                ParticipationStatus.Invited ? (
                  <MenuItem value="invited">
                    <em>Invited</em>
                  </MenuItem>
                ) : null}
                <MenuItem value={ParticipationStatus.Going}>Going</MenuItem>
                <MenuItem value={ParticipationStatus.Maybe}>Maybe</MenuItem>
                <MenuItem value={ParticipationStatus.Declined}>
                  Declined
                </MenuItem>
              </Select>
            </FormControl>
          )}
        </div>
      </div>
      <div>
        {!isEditMode ? (
          <Typography
            variant="body2"
            color="textSecondary"
            css={classes.meetingDescription}
          >
            {meeting.description}
          </Typography>
        ) : (
          <TextField
            inputProps={{ ...register('description'), maxLength: 255 }}
            css={classes.meetingDescriptionInput}
            multiline
            label="Description"
            rows={4}
            fullWidth
            defaultValue={meeting.description}
            variant="filled"
          />
        )}
      </div>
      <div css={classes.meetingInfoRow}>
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
            <Fragment>
              <div css={classes.meetingDateEntry}>
                <Typography variant="subtitle2">From:</Typography>
                <Typography variant="subtitle2">
                  {format(startDate, 'yyyy-MM-dd HH:mm')}
                </Typography>
              </div>
              <div css={classes.meetingDateEntry}>
                <Typography variant="subtitle2">To:</Typography>
                <Typography variant="subtitle2">
                  {format(endDate, 'yyyy-MM-dd HH:mm')}
                </Typography>
              </div>
            </Fragment>
          ) : (
            <div css={classes.meetingDateInputs}>
              <Controller
                render={({ field }) => (
                  <DateTimePicker
                    {...omit(field, 'ref')}
                    label="Start Date"
                    minDate={min([new Date(), startDate])}
                    renderInput={(props) => (
                      <TextField {...props} margin="dense" variant="filled" />
                    )}
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
                    label="End Date"
                    minDate={min([new Date(), endDate])}
                    renderInput={(props) => (
                      <TextField
                        {...props}
                        helperText={
                          errors.endDate?.type === 'validate'
                            ? 'End date must be after start date'
                            : undefined
                        }
                        error={!!errors.endDate}
                        margin="dense"
                        variant="filled"
                      />
                    )}
                  />
                )}
                name="endDate"
                control={control}
                rules={{
                  validate: (value) => {
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
        <div css={classes.meetingLocation}>
          {!isEditMode ? (
            <Fragment>
              <Typography
                css={classes.meetingLocationText}
                variant="subtitle2"
              >{`Location: ${meeting.locationString}`}</Typography>
              <Button
                onClick={onGetDirectionsClick}
                size="small"
                color="primary"
              >
                Get Directions
              </Button>
            </Fragment>
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
                    css={classes.meetingPlaceSelect}
                  />
                );
              }}
              name="location"
              control={control}
              defaultValue={{
                input: meeting.locationString || '',
                place: null,
              }}
            />
          )}
        </div>
      </div>
      <div css={classes.meetingMemberList}>
        <Typography variant="subtitle2">Members:</Typography>
        <AvatarGroup css={classes.meetingMemberListAvatars} max={5}>
          {meeting.participants.map((participant) => (
            <AccountAvatar
              key={participant.id}
              initials={`${participant.name.charAt(
                0,
              )}${participant.lastName.charAt(0)}`}
              color={participant.color}
            />
          ))}
        </AvatarGroup>
        <Button color="primary" onClick={onInviteClick}>
          View all
        </Button>
      </div>
    </div>
  );
};

export default MeetingPageHeader;

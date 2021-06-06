import React, { useEffect } from 'react';
import {
  useForm,
  Controller,
  useFieldArray,
  FieldError,
} from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { DateTimePicker } from '@material-ui/pickers';
import isAfter from 'date-fns/isAfter';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import Checkbox from '@material-ui/core/Checkbox';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { omit } from 'lodash';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import { isMobileSelector } from 'src/modules/app/selectors';
import PlacesAutocomplete, { IValue } from 'src/components/PlacesAutocomplete';
import UserAutocomplete, { IUser } from 'src/components/UserAutocomplete';
import classes from './CreateMeetingForm.module.scss';
import { meetingsCreateMeetingProposal } from '../actions';

interface ICreateMeetingForm {
  meetingName: string;
  description: string;
  usePoll: boolean;
  allowUserPollEntries: boolean;
  dates: Array<{ startDate: Date; endDate: Date }>;
  location: IValue;
  members: IUser[];
}

const CreateMeetingForm: React.FC = () => {
  const {
    control,
    watch,
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateMeetingForm>({
    defaultValues: {
      dates: [{ startDate: new Date(), endDate: new Date() }],
    },
  });
  const { fields, remove, append } = useFieldArray({
    control,
    name: 'dates',
  });

  const isMobile = useAppSelector(isMobileSelector);

  const showPollOptions = watch('usePoll', false);

  const description = watch('description', '');

  const dispatch = useAppDispatch();

  const onSubmit = (data: ICreateMeetingForm) => {
    dispatch(
      meetingsCreateMeetingProposal({
        name: data.meetingName,
        description: data.description,
        canUsersAddPollEntries: !!data.allowUserPollEntries,
        startDate: !data.usePoll ? data.dates[0].startDate.toISOString() : null,
        endDate: !data.usePoll ? data.dates[0].endDate.toISOString() : null,
        locationId: data.location.place ? data.location.place.place_id : null,
        locationString: !data.location.place ? data.location.input : null,
        isDatesPollActive: !!data.usePoll,
        participantIds: data.members.map((value) => value.id),
        datesPollEntries: data.usePoll
          ? data.dates.map((date) => ({
              startDate: date.startDate.toISOString(),
              endDate: date.endDate.toISOString(),
            }))
          : null,
      }),
    );
  };

  useEffect(() => {
    if (!showPollOptions) {
      setValue('dates', [getValues('dates')[0]]);
    }
  }, [showPollOptions]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        inputProps={{
          ...register('meetingName', {
            required: 'Required',
          }),
          maxLength: 100,
        }}
        helperText={errors.meetingName?.message}
        error={!!errors.meetingName}
        margin="dense"
        variant="outlined"
        label="Name"
        fullWidth
      />
      <TextField
        inputProps={{ ...register('description'), maxLength: 255 }}
        helperText={`${description.length}/255`}
        margin="dense"
        variant="outlined"
        label="Description"
        multiline
        rows={4}
        fullWidth
      />
      <Controller
        render={({ field }) => (
          <PlacesAutocomplete
            {...omit(field, 'value', 'onChange', 'ref')}
            realValue={field.value}
            onRealValueChange={(newLocation) => field.onChange(newLocation)}
            variant="outlined"
          />
        )}
        name="location"
        control={control}
        defaultValue={{ input: '', place: null }}
      />
      <Controller
        render={({ field }) => (
          <UserAutocomplete
            {...omit(field, 'value', 'onChange', 'ref')}
            label="Members"
            optionsUrl="/user/selectOptions"
            helperText={
              (errors.members as FieldError | undefined)?.type === 'validate'
                ? 'Select at least one member'
                : undefined
            }
            error={!!errors.members}
            realValue={field.value}
            onRealValueChange={(newValue) => field.onChange(newValue)}
          />
        )}
        name="members"
        control={control}
        defaultValue={[]}
        rules={{
          validate: (value) => !!value.length,
        }}
      />
      <FormControlLabel
        control={
          <Controller
            render={({ field }) => (
              <Checkbox
                {...field}
                color="primary"
                checked={!!field.value}
                onChange={(event) => field.onChange(event.target.checked)}
              />
            )}
            name="usePoll"
            control={control}
            defaultValue={false}
          />
        }
        label="Use Dates Poll"
      />
      {fields.map((item, index) => {
        return (
          <div className={classes.dateFields} key={item.id}>
            {showPollOptions && (
              <div>
                <Typography variant="overline">Option {index + 1}</Typography>
                {isMobile && fields.length > 1 && (
                  <IconButton onClick={() => remove(index)}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </div>
            )}
            <Controller
              render={({ field }) => (
                <DateTimePicker
                  {...omit(field, 'ref')}
                  label="Start Date"
                  margin="dense"
                  disablePast
                  inputVariant="outlined"
                />
              )}
              name={`dates.${index}.startDate` as const}
              control={control}
              defaultValue={new Date()}
            />
            <Controller
              render={({ field }) => (
                <DateTimePicker
                  {...omit(field, 'ref')}
                  helperText={
                    errors.dates?.[index]?.endDate?.type === 'validate'
                      ? 'End date must be after start date'
                      : undefined
                  }
                  error={!!errors.dates?.[index]?.endDate}
                  margin="dense"
                  label="End Date"
                  disablePast
                  inputVariant="outlined"
                />
              )}
              name={`dates.${index}.endDate` as const}
              control={control}
              rules={{
                validate: (value) =>
                  isAfter(value, item.startDate) &&
                  differenceInMinutes(value, item.startDate) > 0,
              }}
              defaultValue={new Date()}
            />
            {isMobile && fields.length - 1 !== index && (
              <Divider className={classes.divider} />
            )}
            {!isMobile && fields.length > 1 && (
              <IconButton onClick={() => remove(index)}>
                <DeleteIcon />
              </IconButton>
            )}
          </div>
        );
      })}
      {showPollOptions && (
        <div className={classes.pollActionsRow}>
          {/* <FormControlLabel
            control={
              <Controller
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    color="primary"
                    checked={!!field.value}
                    onChange={(event) => field.onChange(event.target.checked)}
                  />
                )}
                name="allowUserPollEntries"
                control={control}
                defaultValue={false}
              />
            }
            label="Allow user poll entries"
          /> */}
          <Button
            color="primary"
            startIcon={<AddIcon />}
            onClick={() =>
              append({ startDate: new Date(), endDate: new Date() })
            }
          >
            Add Option
          </Button>
        </div>
      )}
      <div className={classes.submitContainer}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.submitButton}
        >
          Create
        </Button>
      </div>
    </form>
  );
};

export default CreateMeetingForm;

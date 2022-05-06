import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DateTimePicker from '@mui/lab/DateTimePicker';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import isAfter from 'date-fns/isAfter';
import { omit } from 'lodash';
import { useEffect } from 'react';
import {
  useForm,
  Controller,
  useFieldArray,
  FieldError,
} from 'react-hook-form';
import PlacesAutocomplete, { IValue } from 'src/components/PlacesAutocomplete';
import UserAutocomplete, { IUser } from 'src/components/UserAutocomplete';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import { isMobileSelector } from 'src/modules/app/selectors';
import SubmitButton from 'src/modules/formSubmitBlocker/components/SubmitButton';

import { meetingsCreateMeetingProposal } from '../actions';

import classes from './CreateMeetingForm.styles';

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
  }, [showPollOptions, setValue, getValues]);

  return (
    <form>
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
          <div css={classes.dateFields} key={item.id}>
            {showPollOptions && (
              <div>
                <Typography variant="overline">Option {index + 1}</Typography>
                {isMobile && fields.length > 1 && (
                  <IconButton onClick={() => remove(index)} size="large">
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
                  disablePast
                  renderInput={(props) => (
                    <TextField {...props} margin="dense" variant="outlined" />
                  )}
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
                  label="End Date"
                  disablePast
                  renderInput={(props) => (
                    <TextField
                      {...props}
                      helperText={
                        errors.dates?.[index]?.endDate?.type === 'validate'
                          ? 'End date must be after start date'
                          : undefined
                      }
                      error={!!errors.dates?.[index]?.endDate}
                      margin="dense"
                      variant="outlined"
                    />
                  )}
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
              <Divider css={classes.divider} />
            )}
            {!isMobile && fields.length > 1 && (
              <IconButton onClick={() => remove(index)} size="large">
                <DeleteIcon />
              </IconButton>
            )}
          </div>
        );
      })}
      {showPollOptions && (
        <div css={classes.pollActionsRow}>
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
                name="allowUserPollEntries"
                control={control}
                defaultValue={false}
              />
            }
            label="Allow user poll entries"
          />
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
      <div css={classes.submitContainer}>
        <SubmitButton
          type="button"
          variant="contained"
          color="primary"
          css={classes.submitButton}
          onClick={handleSubmit(onSubmit)}
        >
          Create
        </SubmitButton>
      </div>
    </form>
  );
};

export default CreateMeetingForm;

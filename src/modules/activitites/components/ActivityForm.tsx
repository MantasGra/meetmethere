import { ClassNames } from '@emotion/react';
import DateTimePicker from '@mui/lab/DateTimePicker';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import isAfter from 'date-fns/isAfter';
import { omit } from 'lodash';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';

import {
  activitiesCreateActivityProposal,
  activitiesEditActivityProposal,
} from '../actions';
import {
  activitiesEditedActivitySelector,
  activitiesFormDialogMeetingIdSelector,
  activitiesIsFormEditSelector,
} from '../selectors';

import classes from './ActivityForm.styles';

export interface IActivityForm {
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
}

const ActivityForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<IActivityForm>();

  const description = watch('description', '');
  const startTime = watch('startTime', new Date());

  const meetingId = useAppSelector(activitiesFormDialogMeetingIdSelector);

  const isEditForm = useAppSelector(activitiesIsFormEditSelector);
  const editedActivity = useAppSelector(activitiesEditedActivitySelector);

  useEffect(() => {
    if (isEditForm && editedActivity) {
      reset({
        name: editedActivity.name,
        description: editedActivity.description,
        startTime: new Date(editedActivity.startTime),
        endTime: new Date(editedActivity.endTime),
      });
    }
  }, [isEditForm, editedActivity, reset]);

  const dispatch = useAppDispatch();

  const onSubmit = (data: IActivityForm) => {
    if (meetingId) {
      if (isEditForm && editedActivity) {
        dispatch(
          activitiesEditActivityProposal(data, meetingId, editedActivity.id),
        );
      } else {
        dispatch(activitiesCreateActivityProposal(data, meetingId));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        inputProps={{
          ...register('name', { required: 'Required' }),
          maxLength: 100,
        }}
        helperText={errors.name?.message}
        error={!!errors.name}
        margin="dense"
        variant="outlined"
        label="Title"
        fullWidth
      />
      <ClassNames>
        {({ css }) => (
          <TextField
            inputProps={{
              ...register('description'),
              maxLength: 255,
            }}
            helperText={`${description.length}/255`}
            FormHelperTextProps={{
              className: css`
                ${classes.helperTextRight};
              `,
            }}
            margin="dense"
            variant="outlined"
            label="Description"
            fullWidth
            multiline
            rows={4}
          />
        )}
      </ClassNames>
      <div css={classes.dateFields}>
        <Controller
          render={({ field }) => (
            <DateTimePicker
              {...omit(field, 'ref')}
              label="Start Time"
              disablePast
              renderInput={(props) => (
                <TextField {...props} margin="dense" variant="outlined" />
              )}
            />
          )}
          name={'startTime'}
          control={control}
          defaultValue={new Date()}
        />
        <Controller
          render={({ field }) => (
            <DateTimePicker
              {...omit(field, 'ref')}
              label="End Time"
              disablePast
              renderInput={(props) => (
                <TextField
                  {...props}
                  helperText={
                    errors.endTime?.type === 'validate'
                      ? 'End time must be after start time'
                      : undefined
                  }
                  error={!!errors.endTime}
                  margin="dense"
                  variant="outlined"
                />
              )}
            />
          )}
          name={'endTime'}
          control={control}
          rules={{
            validate: (value) =>
              isAfter(value, startTime) &&
              differenceInMinutes(value, startTime) > 0,
          }}
          defaultValue={new Date()}
        />
      </div>
      <div css={classes.submitContainer}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          css={classes.submitButton}
        >
          {isEditForm ? 'Save' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default ActivityForm;

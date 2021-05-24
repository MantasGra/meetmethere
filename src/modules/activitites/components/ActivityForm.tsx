import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { omit } from 'lodash';
import isAfter from 'date-fns/isAfter';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import { DateTimePicker } from '@material-ui/pickers';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import {
  activitiesEditedActivitySelector,
  activitiesFormDialogMeetingIdSelector,
  activitiesIsFormEditSelector,
} from '../selectors';
import {
  activitiesCreateActivityProposal,
  activitiesEditActivityProposal,
} from '../actions';

import classes from './ActivityForm.module.scss';

interface IActivityForm {
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
}

const activityForm: React.FC = () => {
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
  }, [isEditForm, editedActivity]);

  const dispatch = useAppDispatch();

  const onSubmit = (data: IActivityForm) => {
    if (meetingId) {
      if (isEditForm && editedActivity) {
        dispatch(
          activitiesEditActivityProposal(
            {
              ...data,
              startTime: data.startTime.toISOString(),
              endTime: data.endTime.toISOString(),
            },
            meetingId,
            editedActivity.id,
          ),
        );
      } else {
        dispatch(
          activitiesCreateActivityProposal(
            {
              ...data,
              startTime: data.startTime.toISOString(),
              endTime: data.endTime.toISOString(),
            },
            meetingId,
          ),
        );
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
      <TextField
        inputProps={{
          ...register('description'),
          maxLength: 255,
        }}
        helperText={`${description.length}/255`}
        FormHelperTextProps={{
          className: classes.helperTextRight,
        }}
        margin="dense"
        variant="outlined"
        label="Description"
        fullWidth
        multiline
        rows={4}
      />
      <div className={classes.dateFields}>
        <Controller
          render={({ field }) => (
            <DateTimePicker
              {...omit(field, 'ref')}
              label="Start Time"
              margin="dense"
              disablePast
              inputVariant="outlined"
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
              helperText={
                errors.endTime?.type === 'validate'
                  ? 'End time must be after start time'
                  : undefined
              }
              error={!!errors.endTime}
              margin="dense"
              label="End Time"
              disablePast
              inputVariant="outlined"
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
      <div className={classes.submitContainer}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.submitButton}
        >
          {isEditForm ? 'Save' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default activityForm;

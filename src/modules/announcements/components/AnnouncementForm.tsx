import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import {
  announcementsEditedAnnouncementSelector,
  announcementsFormDialogMeetingIdSelector,
  announcementsIsFormEditSelector,
} from '../selectors';
import {
  announcementsCreateAnnouncementProposal,
  announcementsEditAnnouncementProposal,
  ICreateAnnouncementRequest,
} from '../actions';

import classes from './AnnouncementForm.module.scss';

const AnnouncementForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ICreateAnnouncementRequest>();

  const description = watch('description', '');

  const meetingId = useAppSelector(announcementsFormDialogMeetingIdSelector);

  const isEditForm = useAppSelector(announcementsIsFormEditSelector);
  const editedAnnouncement = useAppSelector(
    announcementsEditedAnnouncementSelector,
  );

  useEffect(() => {
    if (isEditForm && editedAnnouncement) {
      reset({
        title: editedAnnouncement.title,
        description: editedAnnouncement.description,
      });
    }
  }, [isEditForm, editedAnnouncement]);

  const dispatch = useAppDispatch();

  const onSubmit = (data: ICreateAnnouncementRequest) => {
    if (meetingId) {
      if (isEditForm && editedAnnouncement) {
        dispatch(
          announcementsEditAnnouncementProposal(
            data,
            meetingId,
            editedAnnouncement.id,
          ),
        );
      } else {
        dispatch(announcementsCreateAnnouncementProposal(data, meetingId));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        inputProps={{
          ...register('title', { required: 'Required' }),
          maxLength: 100,
        }}
        helperText={errors.title?.message}
        error={!!errors.title}
        margin="dense"
        variant="outlined"
        label="Title"
        fullWidth
      />
      <TextField
        inputProps={{
          ...register('description'),
          maxLength: 1000,
        }}
        helperText={`${description.length}/1000`}
        FormHelperTextProps={{
          className: classes.helperTextRight,
        }}
        margin="dense"
        variant="outlined"
        label="Description"
        fullWidth
        multiline
        rows={10}
      />
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

export default AnnouncementForm;

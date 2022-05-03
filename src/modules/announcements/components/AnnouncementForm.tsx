import { ClassNames } from '@emotion/react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';

import {
  announcementsCreateAnnouncementProposal,
  announcementsEditAnnouncementProposal,
} from '../actions';
import {
  announcementsEditedAnnouncementSelector,
  announcementsFormDialogMeetingIdSelector,
  announcementsIsFormEditSelector,
} from '../selectors';

import classes from './AnnouncementForm.styles';

export interface IAnnouncementForm {
  title: string;
  description: string;
}

const AnnouncementForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<IAnnouncementForm>();

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
  }, [isEditForm, editedAnnouncement, reset]);

  const dispatch = useAppDispatch();

  const onSubmit = (data: IAnnouncementForm) => {
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
      <ClassNames>
        {({ css }) => (
          <TextField
            inputProps={{
              ...register('description'),
              maxLength: 1000,
            }}
            helperText={`${description.length}/1000`}
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
            rows={10}
          />
        )}
      </ClassNames>
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

export default AnnouncementForm;

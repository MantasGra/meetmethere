import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CloseableDialogTitle from 'src/components/CloseableDialogTitle';
import AnnouncementForm from './AnnouncementForm';
import { useAppSelector, useAppDispatch } from 'src/hooks/redux';
import {
  announcementsEditAnnouncementIdChange,
  announcementsFormDialogMeetingIdChangeRequest,
} from '../actions';
import {
  announcementsIsFormDialogOpenSelector,
  announcementsIsFormEditSelector,
} from '../selectors';

const AnnouncementFormDialog: React.FC = () => {
  const open = useAppSelector(announcementsIsFormDialogOpenSelector);

  const isEditForm = useAppSelector(announcementsIsFormEditSelector);

  const dispatch = useAppDispatch();

  const onClose = () => {
    if (isEditForm) {
      dispatch(announcementsEditAnnouncementIdChange(null, null));
    } else {
      dispatch(announcementsFormDialogMeetingIdChangeRequest(null));
    }
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <CloseableDialogTitle onClose={onClose}>
        {isEditForm ? 'Update' : 'Create'} Announcement
      </CloseableDialogTitle>
      <DialogContent>
        <AnnouncementForm />
      </DialogContent>
    </Dialog>
  );
};

export default AnnouncementFormDialog;

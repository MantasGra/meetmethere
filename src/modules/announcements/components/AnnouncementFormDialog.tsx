import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseableDialogTitle from 'src/components/CloseableDialogTitle';
import { useAppSelector, useAppDispatch } from 'src/hooks/redux';

import {
  announcementsEditAnnouncementIdChange,
  announcementsFormDialogMeetingIdChangeRequest,
} from '../actions';
import {
  announcementsIsFormDialogOpenSelector,
  announcementsIsFormEditSelector,
} from '../selectors';

import AnnouncementForm from './AnnouncementForm';

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

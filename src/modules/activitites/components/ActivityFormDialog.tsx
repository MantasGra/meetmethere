import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseableDialogTitle from 'src/components/CloseableDialogTitle';
import { useAppSelector, useAppDispatch } from 'src/hooks/redux';

import {
  activitiesEditActivityIdChange,
  activitiesFormDialogMeetingIdChangeRequest,
} from '../actions';
import {
  activitiesIsFormDialogOpenSelector,
  activitiesIsFormEditSelector,
} from '../selectors';

import ActivityForm from './ActivityForm';

const ActivityFormDialog: React.FC = () => {
  const open = useAppSelector(activitiesIsFormDialogOpenSelector);

  const isEditForm = useAppSelector(activitiesIsFormEditSelector);

  const dispatch = useAppDispatch();

  const onClose = () => {
    if (isEditForm) {
      dispatch(activitiesEditActivityIdChange(null, null));
    } else {
      dispatch(activitiesFormDialogMeetingIdChangeRequest(null));
    }
  };

  return (
    <Dialog open={open} maxWidth="md">
      <CloseableDialogTitle onClose={onClose}>
        {isEditForm ? 'Update' : 'Create'} Activity
      </CloseableDialogTitle>
      <DialogContent>
        <ActivityForm />
      </DialogContent>
    </Dialog>
  );
};

export default ActivityFormDialog;

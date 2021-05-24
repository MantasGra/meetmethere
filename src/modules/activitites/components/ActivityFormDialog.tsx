import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CloseableDialogTitle from 'src/components/CloseableDialogTitle';
import ActivityForm from './ActivityForm';
import { useAppSelector, useAppDispatch } from 'src/hooks/redux';
import {
  activitiesEditActivityIdChange,
  activitiesFormDialogMeetingIdChangeRequest,
} from '../actions';
import {
  activitiesIsFormDialogOpenSelector,
  activitiesIsFormEditSelector,
} from '../selectors';

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

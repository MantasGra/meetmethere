import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CloseableDialogTitle from 'src/components/CloseableDialogTitle';
import CreateMeetingForm from './CreateMeetingForm';
import { useAppSelector, useAppDispatch } from 'src/hooks/redux';
import { meetingsIsCreateDialogOpenSelector } from '../selectors';
import { meetingsCreateDialogVisibleChangeRequest } from '../actions';

const CreateMeetingDialog: React.FC = () => {
  const open = useAppSelector(meetingsIsCreateDialogOpenSelector);

  const dispatch = useAppDispatch();
  const onClose = () => {
    dispatch(meetingsCreateDialogVisibleChangeRequest(false));
  };

  return (
    <Dialog open={open} maxWidth="md">
      <CloseableDialogTitle onClose={onClose}>
        Create Meeting
      </CloseableDialogTitle>
      <DialogContent>
        <CreateMeetingForm />
      </DialogContent>
    </Dialog>
  );
};

export default CreateMeetingDialog;

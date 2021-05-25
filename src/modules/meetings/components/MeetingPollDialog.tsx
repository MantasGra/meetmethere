import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CloseableDialogTitle from 'src/components/CloseableDialogTitle';
import MeetingPollForm from './MeetingPollForm';
import { useAppSelector, useAppDispatch } from 'src/hooks/redux';
import { meetingsIsMeetingPollDialogOpenSelector } from '../selectors';
import { meetingsMeetingPollDialogVisibleChangeRequest } from '../actions';

const MeetingPollDialog: React.FC = () => {
  const open = useAppSelector(meetingsIsMeetingPollDialogOpenSelector);

  const dispatch = useAppDispatch();
  const onClose = () => {
    dispatch(meetingsMeetingPollDialogVisibleChangeRequest(null));
  };

  return (
    <Dialog open={open} maxWidth="md">
      <CloseableDialogTitle onClose={onClose}>
        Choose the best dates for you.
      </CloseableDialogTitle>
      <DialogContent>
        <MeetingPollForm />
      </DialogContent>
    </Dialog>
  );
};

export default MeetingPollDialog;

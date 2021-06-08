import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import {
  meetingsCancelingMeetingSelector,
  meetingsCancelMeetingDialogIsOpen,
} from '../selectors';
import { meetingsRespondToCancelingMeeting } from '../actions';
import { MeetingStatus } from '../reducer';

const CancelMeetingConfirmationDialog: React.FC = () => {
  const isOpen = useAppSelector(meetingsCancelMeetingDialogIsOpen);

  const cancelingMeeting = useAppSelector(meetingsCancelingMeetingSelector);

  const isCanceling = cancelingMeeting?.data.status === MeetingStatus.Canceled;

  const dispatch = useAppDispatch();

  const onConfirmClick = () => {
    dispatch(meetingsRespondToCancelingMeeting(true));
  };

  const onCancelClick = () => {
    dispatch(meetingsRespondToCancelingMeeting(false));
  };
  return (
    <Dialog open={isOpen}>
      <DialogTitle>{isCanceling ? 'Cancel' : 'End'} meeting?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to {isCanceling ? 'cancel' : 'end'} this
          meeting? This action can not be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onCancelClick}>
          Keep editing
        </Button>
        <Button color="secondary" onClick={onConfirmClick}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelMeetingConfirmationDialog;

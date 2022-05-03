import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';

import { meetingsRespondToCancelingMeeting } from '../actions';
import { MeetingStatus } from '../reducer';
import {
  meetingsCancelingMeetingSelector,
  meetingsCancelMeetingDialogIsOpen,
} from '../selectors';

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

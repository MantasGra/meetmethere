import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseableDialogTitle from 'src/components/CloseableDialogTitle';
import { useAppSelector, useAppDispatch } from 'src/hooks/redux';

import { meetingsMeetingPollDialogVisibleChangeRequest } from '../actions';
import { meetingsIsMeetingPollDialogOpenSelector } from '../selectors';

import MeetingPollForm from './MeetingPollForm';

const MeetingPollDialog: React.FC = () => {
  const open = useAppSelector(meetingsIsMeetingPollDialogOpenSelector);

  const dispatch = useAppDispatch();
  const onClose = () => {
    dispatch(meetingsMeetingPollDialogVisibleChangeRequest(null));
  };

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
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

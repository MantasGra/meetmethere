import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseableDialogTitle from 'src/components/CloseableDialogTitle';
import UsersList from 'src/components/UsersList';
import { useAppSelector, useAppDispatch } from 'src/hooks/redux';
import {
  meetingsIsMeetingArchived,
  meetingsIsUserCreator,
  meetingsMeetingParticipantsSelector,
} from 'src/modules/meetings/selectors';

import { invitationsInviteUserDialogOpenRequest } from '../actions';
import {
  invitationsInviteUserDialogMeetingIdSelector,
  invitationsInviteUserDialogOpenSelector,
} from '../selectors';

import InviteUserForm from './InviteUserForm';

const InviteUserDialog: React.FC = () => {
  const open = useAppSelector(invitationsInviteUserDialogOpenSelector);

  const meetingId = useAppSelector(
    invitationsInviteUserDialogMeetingIdSelector,
  );

  const users = useAppSelector((state) => {
    if (meetingId) {
      return meetingsMeetingParticipantsSelector(state, meetingId);
    }
    return [];
  });

  const isCreatorUser = useAppSelector((state) => {
    if (meetingId) {
      return meetingsIsUserCreator(state, meetingId);
    }
    return false;
  });

  const isHistoricalMeeting = useAppSelector((state) => {
    if (meetingId) {
      return meetingsIsMeetingArchived(state, meetingId);
    }
    return true;
  });

  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(invitationsInviteUserDialogOpenRequest(null));
  };

  return (
    <Dialog open={open} maxWidth="md">
      <CloseableDialogTitle onClose={onClose}>Members</CloseableDialogTitle>
      <DialogContent>
        <UsersList users={users} />
        {isCreatorUser && !isHistoricalMeeting && <InviteUserForm />}
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserDialog;

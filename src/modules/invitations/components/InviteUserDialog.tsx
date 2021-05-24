import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CloseableDialogTitle from 'src/components/CloseableDialogTitle';
import InviteUserForm from './InviteUserForm';
import { useAppSelector, useAppDispatch } from 'src/hooks/redux';
import {
  invitationsInviteUserDialogMeetingIdSelector,
  invitationsInviteUserDialogOpenSelector,
} from '../selectors';
import { invitationsInviteUserDialogOpenRequest } from '../actions';
import {
  meetingsIsMeetingHistorical,
  meetingsIsUserCreator,
  meetingsMeetingParticipantsSelector,
} from 'src/modules/meetings/selectors';
import UsersList from 'src/components/UsersList';

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
      return meetingsIsMeetingHistorical(state, meetingId);
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

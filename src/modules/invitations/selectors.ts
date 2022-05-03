import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../app/reducer';
import { authCurrentUserIdSelector } from '../auth/selectors';

import { InvitationState, ParticipationStatus } from './reducer';

export const invitationsStateSelector = (state: RootState): InvitationState =>
  state.invitations;

export const invitationsListSelector = createSelector(
  invitationsStateSelector,
  authCurrentUserIdSelector,
  (invitationsState, currentUserId) =>
    [...invitationsState.invitations].sort((lhs, rhs) => {
      const lhsParticipationStatus = lhs.participants.find(
        (participant) => participant.id === currentUserId,
      )?.userParticipationStatus;
      const rhsParticipationStatus = rhs.participants.find(
        (participant) => participant.id === currentUserId,
      )?.userParticipationStatus;
      if (
        lhsParticipationStatus === ParticipationStatus.Invited &&
        rhsParticipationStatus === ParticipationStatus.Declined
      ) {
        return -1;
      }
      if (
        lhsParticipationStatus === ParticipationStatus.Declined &&
        rhsParticipationStatus === ParticipationStatus.Invited
      ) {
        return 1;
      }
      return 0;
    }),
);

export const invitationsLoadingSelector = createSelector(
  invitationsStateSelector,
  (invitationsState) => invitationsState.invitationsLoading,
);

export const invitationsInviteUserDialogMeetingIdSelector = createSelector(
  invitationsStateSelector,
  (invitationsState) => invitationsState.inviteUserDialogOpen,
);

export const invitationsInviteUserDialogOpenSelector = createSelector(
  invitationsInviteUserDialogMeetingIdSelector,
  (meetingId) => !!meetingId,
);

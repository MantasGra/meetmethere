import type { RootState } from '../app/reducer';
import type { IInvitation } from './reducer';

export const invitationsListSelector = (state: RootState): IInvitation[] =>
  state.invitations.invitations;

export const invitationsLoadingSelector = (state: RootState): boolean =>
  state.invitations.invitationsLoading;

export const invitationsInviteUserDialogOpenSelector = (
  state: RootState,
): boolean => !!state.invitations.inviteUserDialogOpen;

export const invitationsInviteUserDialogMeetingIdSelector = (
  state: RootState,
): number | null => state.invitations.inviteUserDialogOpen;

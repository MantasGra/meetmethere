import type { RootState } from '../app/reducer';
import type { IInvitation } from './reducer';

export const invitationsListSelector = (state: RootState): IInvitation[] =>
  state.invitations.invitations;

export const invitationsLoadingSelector = (state: RootState): boolean =>
  state.invitations.invitationsLoading;

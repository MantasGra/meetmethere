import { createAction } from '@reduxjs/toolkit';
import type { IInvitation } from './reducer';

export const invitationsLoadInvitationsProposal = createAction(
  'invitations/loadInvitationsProposal',
);

export const invitationsLoadInvitationsSuccess = createAction(
  'invitations/loadMeetingsSuccess',
  (invitations: IInvitation[]) => ({
    payload: { invitations },
  }),
);

export const invitationsLoadInvitationsFail = createAction(
  'invitations/loadInvitationsFail',
);

export type InvitationsActions =
  | ReturnType<typeof invitationsLoadInvitationsProposal>
  | ReturnType<typeof invitationsLoadInvitationsSuccess>
  | ReturnType<typeof invitationsLoadInvitationsFail>;

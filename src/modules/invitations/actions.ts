import { createAction } from '@reduxjs/toolkit';

import { withPayloadType } from '../app/actions';
import type { IMeeting } from '../meetings/reducer';

export const invitationsLoadInvitationsProposal = createAction(
  'invitations/loadInvitationsProposal',
);

export const invitationsLoadInvitationsSuccess = createAction(
  'invitations/loadMeetingsSuccess',
  (invitations: IMeeting[]) => ({
    payload: { invitations },
  }),
);

export const invitationsLoadInvitationsFail = createAction(
  'invitations/loadInvitationsFail',
);

export const invitationsInviteUserDialogOpenRequest = createAction(
  'invitations/inviteUserDialogOpen',
  withPayloadType<number | null>(),
);

export const invitationsInviteUsersToMeeting = createAction(
  'invitations/inviteUsersToMeetings',
  (meetingId: number, newUserIds: number[]) => ({
    payload: { meetingId, newUserIds },
  }),
);

export type InvitationsActions =
  | ReturnType<typeof invitationsLoadInvitationsProposal>
  | ReturnType<typeof invitationsLoadInvitationsSuccess>
  | ReturnType<typeof invitationsLoadInvitationsFail>
  | ReturnType<typeof invitationsInviteUserDialogOpenRequest>
  | ReturnType<typeof invitationsInviteUsersToMeeting>;

import { createReducer } from '@reduxjs/toolkit';

import { meetingsChangeUserParticipationStatus } from '../meetings/actions';
import type { IMeeting } from '../meetings/reducer';

import {
  invitationsLoadInvitationsProposal,
  invitationsLoadInvitationsSuccess,
  invitationsLoadInvitationsFail,
  invitationsInviteUserDialogOpenRequest,
} from './actions';

export enum ParticipationStatus {
  Invited = 'invited',
  Maybe = 'maybe',
  Going = 'going',
  Declined = 'declined',
}

export interface InvitationState {
  invitations: IMeeting[];
  invitationsLoading: boolean;
  invitationsLoadingFailed: boolean;
  inviteUserDialogOpen: number | null;
}

const initialState: InvitationState = {
  invitations: [],
  invitationsLoading: false,
  invitationsLoadingFailed: false,
  inviteUserDialogOpen: null,
};

const invitationsReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(invitationsLoadInvitationsProposal, (state) => {
      state.invitationsLoading = true;
    })
    .addCase(invitationsLoadInvitationsSuccess, (state, action) => {
      state.invitations = action.payload.invitations;
      state.invitationsLoading = false;
      state.invitationsLoadingFailed = false;
    })
    .addCase(invitationsLoadInvitationsFail, (state) => {
      state.invitationsLoading = false;
      state.invitationsLoadingFailed = true;
    })
    .addCase(meetingsChangeUserParticipationStatus, (state, action) => {
      if (
        ![ParticipationStatus.Invited, ParticipationStatus.Declined].includes(
          action.payload.status,
        )
      ) {
        state.invitations.filter((invitation) => {
          invitation.id !== action.payload.meetingId;
        });
      }
    })
    .addCase(invitationsInviteUserDialogOpenRequest, (state, action) => {
      state.inviteUserDialogOpen = action.payload;
    }),
);

export default invitationsReducer;

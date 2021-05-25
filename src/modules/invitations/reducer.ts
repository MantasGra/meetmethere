import { createReducer } from '@reduxjs/toolkit';
import { meetingsChangeUserParticipationStatus } from '../meetings/actions';
import type { IMeeting } from '../meetings/reducer';
import {
  invitationsLoadInvitationsProposal,
  invitationsLoadInvitationsSuccess,
  invitationsLoadInvitationsFail,
} from './actions';

export enum ParticipationStatus {
  Invited = 'invited',
  Maybe = 'maybe',
  Going = 'going',
  Declined = 'declined',
}

export interface IInvitation {
  id: number;
  userParticipationStatus: ParticipationStatus;
  meeting: IMeeting;
}

interface InvitationState {
  invitations: IInvitation[];
  invitationsLoading: boolean;
  invitationsLoadingFailed: boolean;
}

const initialState: InvitationState = {
  invitations: [],
  invitationsLoading: false,
  invitationsLoadingFailed: false,
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
      if (action.payload.newStatus !== ParticipationStatus.Invited) {
        state.invitations.filter((invitation) => {
          invitation.meeting.id !== action.payload.meetingId
        })
      }
    }),
);

export default invitationsReducer;

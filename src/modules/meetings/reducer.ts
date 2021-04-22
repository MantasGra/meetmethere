import { createReducer } from '@reduxjs/toolkit';
import type { IUser } from '../auth/reducer';
import {
  meetingsAddMeeting,
  meetingsCreateDialogVisibleChangeRequest,
  meetingsLoadMeetingsSuccess,
} from './actions';

export enum MeetingStatus {
  Planned,
  Postponed,
  Started,
  Extended,
  Ended,
  Canceled,
}

export interface IMeeting {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: MeetingStatus;
  isDatesPollActive: boolean;
  canUsersAddPollEntries: boolean;
  creator: IUser;
  participants: IUser[];
}

interface MeetingState {
  plannedMeetings: IMeeting[];
  isCreateDialogOpen: boolean;
}

const initialState: MeetingState = {
  plannedMeetings: [],
  isCreateDialogOpen: false,
};

const meetingsReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(meetingsCreateDialogVisibleChangeRequest, (state, action) => {
      state.isCreateDialogOpen = action.payload;
    })
    .addCase(meetingsLoadMeetingsSuccess, (state, action) => {
      state.plannedMeetings = action.payload;
    })
    .addCase(meetingsAddMeeting, (state, action) => {
      state.plannedMeetings.push(action.payload);
    }),
);

export default meetingsReducer;

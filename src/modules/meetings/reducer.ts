import { createReducer } from '@reduxjs/toolkit';
import { sortedIndexBy } from 'lodash';
import type { IUser } from '../auth/reducer';
import {
  meetingsAddMeeting,
  meetingsCreateDialogVisibleChangeRequest,
  meetingsLoadMeetingsFail,
  meetingsLoadMeetingsProposal,
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
  locationId: string;
  locationString: string | null;
  status: MeetingStatus;
  isDatesPollActive: boolean;
  canUsersAddPollEntries: boolean;
  creator: IUser;
  participants: IUser[];
}

interface MeetingState {
  plannedMeetingsLoading: boolean;
  plannedMeetingIds: number[];
  plannedMeetings: Record<number, IMeeting>;
  plannedMeetingCount: number;
  plannedMeetingLoadFailed: boolean;
  isCreateDialogOpen: boolean;
}

const initialState: MeetingState = {
  plannedMeetingsLoading: false,
  plannedMeetingIds: [],
  plannedMeetings: {},
  plannedMeetingCount: 0,
  plannedMeetingLoadFailed: false,
  isCreateDialogOpen: false,
};

const meetingsReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(meetingsCreateDialogVisibleChangeRequest, (state, action) => {
      state.isCreateDialogOpen = action.payload;
    })
    .addCase(meetingsLoadMeetingsProposal, (state) => {
      state.plannedMeetingsLoading = true;
    })
    .addCase(meetingsLoadMeetingsSuccess, (state, action) => {
      action.payload.meetings.forEach((meeting) => {
        state.plannedMeetings[meeting.id] = meeting;
        if (!state.plannedMeetingIds.includes(meeting.id)) {
          state.plannedMeetingIds.push(meeting.id);
        }
      });
      state.plannedMeetingCount = action.payload.meetingCount;
      state.plannedMeetingsLoading = false;
      state.plannedMeetingLoadFailed = false;
    })
    .addCase(meetingsLoadMeetingsFail, (state) => {
      state.plannedMeetingsLoading = false;
      state.plannedMeetingLoadFailed = true;
    })
    .addCase(meetingsAddMeeting, (state, action) => {
      state.plannedMeetings[action.payload.id] = action.payload;
      state.plannedMeetingIds.splice(
        sortedIndexBy(
          state.plannedMeetingIds,
          action.payload.id,
          (id) => state.plannedMeetings[id].startDate,
        ),
        0,
        action.payload.id,
      );
    }),
);

export default meetingsReducer;

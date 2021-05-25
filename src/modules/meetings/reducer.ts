import { createReducer } from '@reduxjs/toolkit';
import { sortedIndexBy } from 'lodash';
import type { IUser } from '../auth/reducer';
import {
  meetingsAddMeeting,
  meetingsCreateDialogVisibleChangeRequest,
  meetingsLoadMeetingsFail,
  meetingsLoadMeetingsProposal,
  meetingsLoadMeetingsSuccess,
  meetingsSwitchToTab,
  meetingsLoadMeetingFail,
  meetingsMeetingPollDialogVisibleChangeRequest,
  meetingsMeetingPollDatesResponseChangeSuccess,
} from './actions';

export enum MeetingStatus {
  Planned,
  Postponed,
  Started,
  Extended,
  Ended,
  Canceled,
}

export enum MeetingTabs {
  Announcements = 0,
  Activities = 1,
  Expenses = 2,
}

export interface IMeetingDatesPollEntry {
  id: number;
  startDate: Date;
  endDate: Date;
  userMeetingDatesPollEntries: Array<{ id: number; user: IUser }>;
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
  meetingDatesPollEntries: IMeetingDatesPollEntry[];
}

interface MeetingState {
  plannedMeetingsLoading: boolean;
  plannedMeetingIds: number[];
  plannedMeetings: Record<number, IMeeting>;
  plannedMeetingCount: number;
  plannedMeetingLoadFailed: boolean;
  activeMeetingTab: MeetingTabs;
  meetingLoadFailed: boolean;
  isCreateDialogOpen: boolean;
  meetingPollFormId: number | null;
}

const initialState: MeetingState = {
  plannedMeetingsLoading: false,
  plannedMeetingIds: [],
  plannedMeetings: {},
  plannedMeetingCount: 0,
  plannedMeetingLoadFailed: false,
  activeMeetingTab: MeetingTabs.Announcements,
  meetingLoadFailed: false,
  isCreateDialogOpen: false,
  meetingPollFormId: null,
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
          state.plannedMeetingIds.splice(
            sortedIndexBy(
              state.plannedMeetingIds,
              meeting.id,
              (id) => state.plannedMeetings[id].startDate,
            ),
            0,
            meeting.id,
          );
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
      state.meetingLoadFailed = false;
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
    })
    .addCase(meetingsSwitchToTab, (state, action) => {
      state.activeMeetingTab = action.payload;
    })
    .addCase(meetingsLoadMeetingFail, (state) => {
      state.meetingLoadFailed = true;
    })
    .addCase(meetingsMeetingPollDialogVisibleChangeRequest, (state, action) => {
      state.meetingPollFormId = action.payload;
    })
    .addCase(meetingsMeetingPollDatesResponseChangeSuccess, (state, action) => {
      state.plannedMeetings[action.payload.meetingId].meetingDatesPollEntries =
        action.payload.entries;
    }),
);

export default meetingsReducer;

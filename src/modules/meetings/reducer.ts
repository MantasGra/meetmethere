import { createReducer } from '@reduxjs/toolkit';
import { compareAsc } from 'date-fns';
import { keyBy, uniq } from 'lodash';
import { getComparerByGetter } from 'src/utils/sortUtils';
import { toDate } from 'src/utils/transformators';

import type { IParticipant, IUser } from '../auth/reducer';

import {
  meetingsAddMeeting,
  meetingsCreateDialogVisibleChangeRequest,
  meetingsLoadMeetingsFail,
  meetingsLoadMeetingsProposal,
  meetingsLoadMeetingsSuccess,
  meetingsSwitchToTab,
  meetingsLoadMeetingProposal,
  meetingsLoadMeetingFail,
  meetingsMeetingPollDialogVisibleChangeRequest,
  meetingsMeetingPollDatesResponseChangeSuccess,
  meetingsChangeUserParticipationStatus,
  meetingsAddUsersToMeeting,
  meetingsEditModeChange,
  meetingsModifyMeeting,
  meetingsUpdateMeetingRequest,
  meetingsChangeCancelingMeeting,
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

export enum MeetingTypes {
  Planned = 'planned',
  Archived = 'archived',
}

export interface IMeetingDatesPollEntry {
  id: number;
  startDate: Date;
  endDate: Date;
  users: IUser[];
}

export interface IMeeting {
  id: number;
  name: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  locationId: string | null;
  locationString: string | null;
  status: MeetingStatus;
  isDatesPollActive: boolean;
  canUsersAddPollEntries: boolean;
  creator: IUser;
  participants: IParticipant[];
  meetingDatesPollEntries: IMeetingDatesPollEntry[];
}

export declare const updateRequest: ReturnType<
  typeof meetingsUpdateMeetingRequest
>;

interface MeetingStateData {
  loading: boolean;
  ids: number[];
  count?: number; // could be undefined - it signifies unknown count
  loadFailed: boolean;
}

export interface MeetingState {
  meetings: Record<number, IMeeting>;
  meetingLoading: boolean;
  meetingLoadFailed: boolean;
  meetingListData: {
    [MeetingTypes.Planned]: MeetingStateData;
    [MeetingTypes.Archived]: MeetingStateData;
  };
  activeMeetingTab: MeetingTabs;
  isCreateDialogOpen: boolean;
  meetingPollFormId: number | null;
  editMode: number | null;
  cancelingMeeting: typeof updateRequest.payload | null;
}

const initialListDataState: MeetingStateData = {
  loading: false,
  ids: [],
  loadFailed: false,
};

const initialState: MeetingState = {
  meetings: {},
  meetingLoading: false,
  meetingLoadFailed: false,
  meetingListData: {
    [MeetingTypes.Planned]: initialListDataState,
    [MeetingTypes.Archived]: initialListDataState,
  },
  activeMeetingTab: MeetingTabs.Announcements,
  isCreateDialogOpen: false,
  meetingPollFormId: null,
  editMode: null,
  cancelingMeeting: null,
};

const meetingsReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(meetingsCreateDialogVisibleChangeRequest, (state, action) => {
      state.isCreateDialogOpen = action.payload;
    })
    .addCase(meetingsLoadMeetingsProposal, (state, action) => {
      const { typeOfMeeting, page } = action.payload;
      if (page === 1) {
        state.meetingListData[typeOfMeeting] = {
          ...initialListDataState,
          loading: true,
        };
      } else {
        state.meetingListData[typeOfMeeting].loading = true;
      }
    })
    .addCase(meetingsLoadMeetingsSuccess, (state, action) => {
      const { meetings, meetingCount, typeOfMeeting } = action.payload;

      state.meetings = {
        ...state.meetings,
        ...keyBy(meetings, 'id'),
      };

      state.meetingListData[typeOfMeeting].ids = uniq([
        ...state.meetingListData[typeOfMeeting].ids,
        ...meetings.map((meeting) => meeting.id),
      ]).sort(
        getComparerByGetter(
          (id) => toDate(state.meetings[id].startDate),
          compareAsc,
        ),
      );

      state.meetingListData[typeOfMeeting].count = meetingCount;
      state.meetingListData[typeOfMeeting].loading = false;
      state.meetingListData[typeOfMeeting].loadFailed = false;
    })
    .addCase(meetingsLoadMeetingsFail, (state, action) => {
      state.meetingListData[action.payload].loading = false;
      state.meetingListData[action.payload].loadFailed = true;
    })
    .addCase(meetingsAddMeeting, (state, action) => {
      const { meeting, typeOfMeeting } = action.payload;
      state.meetings[meeting.id] = meeting;
      state.meetingLoading = false;
      if (typeOfMeeting) {
        if (!state.meetingListData[typeOfMeeting].ids.includes(meeting.id)) {
          state.meetingListData[typeOfMeeting].ids.push(meeting.id);
          state.meetingListData[typeOfMeeting].count = undefined;
        }
        state.meetingListData[typeOfMeeting].ids.sort(
          getComparerByGetter(
            (id) => toDate(state.meetings[id].startDate),
            compareAsc,
          ),
        );
      }
    })
    .addCase(meetingsSwitchToTab, (state, action) => {
      state.activeMeetingTab = action.payload;
    })
    .addCase(meetingsLoadMeetingProposal, (state) => {
      state.meetingLoading = true;
    })
    .addCase(meetingsLoadMeetingFail, (state) => {
      state.meetingLoadFailed = true;
    })
    .addCase(meetingsMeetingPollDialogVisibleChangeRequest, (state, action) => {
      state.meetingPollFormId = action.payload;
    })
    .addCase(meetingsMeetingPollDatesResponseChangeSuccess, (state, action) => {
      state.meetings[action.payload.meetingId].meetingDatesPollEntries =
        action.payload.entries;
    })
    .addCase(meetingsChangeUserParticipationStatus, (state, action) => {
      const { meetingId, userId, status } = action.payload;
      state.meetings[meetingId].participants.some((participant) => {
        if (participant.id === userId) {
          participant.userParticipationStatus = status;
          return true;
        }
        return false;
      });
    })
    .addCase(meetingsAddUsersToMeeting, (state, action) => {
      const { meetingId, newUsers } = action.payload;
      state.meetings[meetingId].participants.push(...newUsers);
    })
    .addCase(meetingsEditModeChange, (state, action) => {
      state.editMode = action.payload;
      if (action.payload === null) {
        state.cancelingMeeting = null;
      }
    })
    .addCase(meetingsModifyMeeting, (state, action) => {
      const { id, meeting } = action.payload;
      state.meetings[id] = { ...state.meetings[id], ...meeting };
    })
    .addCase(meetingsChangeCancelingMeeting, (state, action) => {
      state.cancelingMeeting = action.payload;
    }),
);

export default meetingsReducer;

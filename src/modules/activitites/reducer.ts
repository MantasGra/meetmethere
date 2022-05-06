import { createReducer } from '@reduxjs/toolkit';
import { keyBy } from 'lodash';

import {
  activitiesAddActivity,
  activitiesDeleteActivityRequest,
  activitiesEditActivityIdChange,
  activitiesEditActivityRequest,
  activitiesFormDialogMeetingIdChangeRequest,
  activitiesLoadActivitiesProposal,
  activitiesLoadActivitiesSuccess,
  activitiesLoadFailed,
} from './actions';

export interface IActivity {
  id: number;
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
}

export interface ActivityState {
  activitesLoading: boolean;
  activityIds: number[];
  activities: Record<number, IActivity>;
  activitiesLoadFailed: boolean;
  formDialogMeetingId: number | null;
  formDialogActivityId: number | null;
}

const initialState: ActivityState = {
  activitesLoading: false,
  activityIds: [],
  activities: {},
  activitiesLoadFailed: false,
  formDialogMeetingId: null,
  formDialogActivityId: null,
};

const activitiesReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(activitiesLoadActivitiesProposal, (state) => {
      state.activitesLoading = true;
      state.activityIds = [];
      state.activities = {};
    })
    .addCase(activitiesLoadActivitiesSuccess, (state, action) => {
      state.activities = keyBy(action.payload, 'id');
      state.activityIds = action.payload.map((activity) => activity.id);
      state.activitiesLoadFailed = false;
      state.activitesLoading = false;
    })
    .addCase(activitiesLoadFailed, (state) => {
      state.activitesLoading = false;
      state.activitiesLoadFailed = true;
    })
    .addCase(activitiesFormDialogMeetingIdChangeRequest, (state, action) => {
      state.formDialogMeetingId = action.payload;
    })
    .addCase(activitiesAddActivity, (state, action) => {
      state.activities[action.payload.id] = action.payload;
      state.activityIds.push(action.payload.id);
    })
    .addCase(activitiesDeleteActivityRequest, (state, action) => {
      delete state.activities[action.payload];
      state.activityIds = state.activityIds.filter(
        (id) => id !== action.payload,
      );
    })
    .addCase(activitiesEditActivityIdChange, (state, action) => {
      state.formDialogActivityId = action.payload.activityId;
      state.formDialogMeetingId = action.payload.meetingId;
    })
    .addCase(activitiesEditActivityRequest, (state, action) => {
      state.activities[action.payload.id] = action.payload;
    }),
);

export default activitiesReducer;

import { createReducer } from '@reduxjs/toolkit';
import compareDesc from 'date-fns/compareDesc';
import {
  activitiesAddActivity,
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

interface ActivityState {
  activitesLoading: boolean;
  activityIds: number[];
  activities: Record<number, IActivity>;
  activitiesLoadFailed: boolean;
  formDialogMeetingId: number | null;
}

const initialState: ActivityState = {
  activitesLoading: false,
  activityIds: [],
  activities: {},
  activitiesLoadFailed: false,
  formDialogMeetingId: null,
};

const activitiesReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(activitiesLoadActivitiesProposal, (state) => {
      state.activitesLoading = true;
      state.activityIds = [];
      state.activities = {};
    })
    .addCase(activitiesLoadActivitiesSuccess, (state, action) => {
      action.payload.forEach((activity) => {
        state.activities[activity.id] = activity;
        if (!state.activityIds.includes(activity.id)) {
          state.activityIds.push(activity.id);
        }
      });
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
      state.activityIds.sort(compareDesc);
    }),
);

export default activitiesReducer;

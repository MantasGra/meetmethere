import { createAction } from '@reduxjs/toolkit';

import { withPayloadType } from '../app/actions';

import { IActivityForm } from './components/ActivityForm';
import type { IActivity } from './reducer';

export const activitiesLoadActivitiesProposal = createAction(
  'activities/loadActivitiesProposal',
  withPayloadType<number>(),
);

export const activitiesLoadActivitiesSuccess = createAction(
  'activities/loadActivitiesSuccess',
  withPayloadType<IActivity[]>(),
);

export const activitiesLoadFailed = createAction(
  'activities/loadActivitiesFail',
);

export const activitiesFormDialogMeetingIdChangeRequest = createAction(
  'activities/formDialogMeetingIdChangeRequest',
  withPayloadType<number | null>(),
);

export const activitiesCreateActivityProposal = createAction(
  'activities/createActivityProposal',
  (activity: IActivityForm, meetingId: number) => ({
    payload: {
      activity,
      meetingId,
    },
  }),
);

export const activitiesAddActivity = createAction(
  'activities/addActivity',
  withPayloadType<IActivity>(),
);

export const activitiesDeleteActivityProposal = createAction(
  'activities/deleteActivityProposal',
  (meetingId: number, activityId: number) => ({
    payload: { meetingId, activityId },
  }),
);

export const activitiesDeleteActivityRequest = createAction(
  'activities/deleteActivityRequest',
  withPayloadType<number>(),
);

export const activitiesEditActivityIdChange = createAction(
  'activities/editActivityIdChange',
  (meetingId: number | null, activityId: number | null) => ({
    payload: { meetingId, activityId },
  }),
);

export const activitiesEditActivityProposal = createAction(
  'activities/editActivityProposal',
  (activity: IActivityForm, meetingId: number, activityId: number) => ({
    payload: {
      activity,
      meetingId,
      activityId,
    },
  }),
);

export const activitiesEditActivityRequest = createAction(
  'activities/editActivityRequest',
  withPayloadType<IActivity>(),
);

export type ActivitiesActions =
  | ReturnType<typeof activitiesLoadActivitiesProposal>
  | ReturnType<typeof activitiesLoadActivitiesSuccess>
  | ReturnType<typeof activitiesLoadFailed>
  | ReturnType<typeof activitiesFormDialogMeetingIdChangeRequest>
  | ReturnType<typeof activitiesCreateActivityProposal>
  | ReturnType<typeof activitiesAddActivity>
  | ReturnType<typeof activitiesDeleteActivityProposal>
  | ReturnType<typeof activitiesDeleteActivityRequest>
  | ReturnType<typeof activitiesEditActivityIdChange>
  | ReturnType<typeof activitiesEditActivityProposal>
  | ReturnType<typeof activitiesEditActivityRequest>;

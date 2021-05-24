import { createAction } from '@reduxjs/toolkit';
import { withPayloadType } from '../app/actions';
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

interface ICreateActivityRequest {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
}

export const activitiesCreateActivityProposal = createAction(
  'activities/createActivityProposal',
  (activity: ICreateActivityRequest, meetingId: number) => ({
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

export type ActivitiesActions =
  | ReturnType<typeof activitiesLoadActivitiesProposal>
  | ReturnType<typeof activitiesLoadActivitiesSuccess>
  | ReturnType<typeof activitiesLoadFailed>
  | ReturnType<typeof activitiesFormDialogMeetingIdChangeRequest>
  | ReturnType<typeof activitiesCreateActivityProposal>
  | ReturnType<typeof activitiesAddActivity>;

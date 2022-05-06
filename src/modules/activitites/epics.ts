import { combineEpics } from 'redux-observable';
import { of } from 'rxjs';
import { mergeMap, map, pluck, catchError } from 'rxjs/operators';
import { fromAxios, ofActionType } from 'src/utils/operators';

import type { AppEpic } from '../app/epics';
import { snackbarsEnqueue } from '../snackbars/actions';

import {
  activitiesAddActivity,
  activitiesCreateActivityProposal,
  activitiesFormDialogMeetingIdChangeRequest,
  activitiesLoadFailed,
  activitiesLoadActivitiesProposal,
  activitiesLoadActivitiesSuccess,
  activitiesDeleteActivityProposal,
  activitiesDeleteActivityRequest,
  activitiesEditActivityProposal,
  activitiesEditActivityRequest,
  activitiesEditActivityIdChange,
} from './actions';
import type { IActivity } from './reducer';

const loadActivitiesEpic: AppEpic = (action$, _, { axios }) =>
  action$.pipe(
    ofActionType(activitiesLoadActivitiesProposal),
    pluck('payload'),
    mergeMap((meetingId) =>
      fromAxios<IActivity[]>(axios, {
        url: `/meeting/${meetingId}/activities`,
        method: 'GET',
        withCredentials: true,
      }).pipe(
        map((response) => activitiesLoadActivitiesSuccess(response.data)),
        catchError(() => of(activitiesLoadFailed())),
      ),
    ),
  );

const createActivityEpic: AppEpic = (action$, _, { axios }) =>
  action$.pipe(
    ofActionType(activitiesCreateActivityProposal),
    pluck('payload'),
    mergeMap(({ activity, meetingId }) =>
      fromAxios<IActivity>(axios, {
        url: `/meeting/${meetingId}/activities`,
        method: 'POST',
        data: activity,
        withCredentials: true,
      }).pipe(
        mergeMap((response) =>
          of(
            activitiesAddActivity(response.data),
            activitiesFormDialogMeetingIdChangeRequest(null),
            snackbarsEnqueue({
              message: 'Activity created!',
              options: {
                variant: 'success',
              },
            }),
          ),
        ),
        catchError(() =>
          of(
            snackbarsEnqueue({
              message: 'Activity creation failed!',
              options: {
                variant: 'error',
              },
            }),
          ),
        ),
      ),
    ),
  );

const deleteActivityEpic: AppEpic = (action$, _, { axios }) =>
  action$.pipe(
    ofActionType(activitiesDeleteActivityProposal),
    pluck('payload'),
    mergeMap(({ meetingId, activityId }) =>
      fromAxios<never>(axios, {
        url: `/meeting/${meetingId}/activities/${activityId}`,
        method: 'DELETE',
        withCredentials: true,
      }).pipe(
        mergeMap(() =>
          of(
            activitiesDeleteActivityRequest(activityId),
            snackbarsEnqueue({
              message: 'Activity deleted!',
              options: {
                variant: 'success',
              },
            }),
          ),
        ),
        catchError(() =>
          of(
            snackbarsEnqueue({
              message: 'Failed to delete activity!',
              options: {
                variant: 'error',
              },
            }),
          ),
        ),
      ),
    ),
  );

const editActivityEpic: AppEpic = (action$, _, { axios }) =>
  action$.pipe(
    ofActionType(activitiesEditActivityProposal),
    pluck('payload'),
    mergeMap(({ meetingId, activityId, activity }) =>
      fromAxios<IActivity>(axios, {
        url: `/meeting/${meetingId}/activities/${activityId}`,
        method: 'PATCH',
        data: activity,
        withCredentials: true,
      }).pipe(
        mergeMap((response) =>
          of(
            activitiesEditActivityRequest(response.data),
            activitiesEditActivityIdChange(null, null),
            snackbarsEnqueue({
              message: 'Activity updated!',
              options: {
                variant: 'success',
              },
            }),
          ),
        ),
        catchError(() =>
          of(
            snackbarsEnqueue({
              message: 'Failed to update activity!',
              options: {
                variant: 'error',
              },
            }),
          ),
        ),
      ),
    ),
  );

export default combineEpics(
  loadActivitiesEpic,
  createActivityEpic,
  deleteActivityEpic,
  editActivityEpic,
);

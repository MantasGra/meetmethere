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
} from './actions';
import type { IActivity } from './reducer';

const loadActivitysEpic: AppEpic = (action$, _, { axios }) =>
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
                key: new Date().getTime() + Math.random(),
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
                key: new Date().getTime() + Math.random(),
                variant: 'error',
              },
            }),
          ),
        ),
      ),
    ),
  );

export default combineEpics(loadActivitysEpic, createActivityEpic);

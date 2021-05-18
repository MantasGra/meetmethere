import { combineEpics } from 'redux-observable';
import { forkJoin, of, from } from 'rxjs';
import { mergeMap, pluck, map, catchError } from 'rxjs/operators';
import Geocoder from 'src/utils/Geocoder';
import { fromAxios, ofActionType } from 'src/utils/operators';
import type { AppEpic } from '../app/epics';
import { snackbarsEnqueue } from '../snackbars/actions';
import {
  meetingsAddMeeting,
  meetingsCreateDialogVisibleChangeRequest,
  meetingsCreateMeetingProposal,
  meetingsLoadMeetingsFail,
  meetingsLoadMeetingsProposal,
  meetingsLoadMeetingsSuccess,
} from './actions';
import type { IMeeting } from './reducer';

interface ICreateMeetingResponse {
  createdMeeting: IMeeting;
}

const createMeetingEpic: AppEpic = (action$, _, { axios }) =>
  action$.pipe(
    ofActionType(meetingsCreateMeetingProposal),
    pluck('payload'),
    mergeMap((formData) =>
      fromAxios<ICreateMeetingResponse>(axios, {
        url: '/meeting',
        method: 'POST',
        data: formData,
        withCredentials: true,
      }).pipe(
        mergeMap((response) =>
          of(
            meetingsAddMeeting(response.data.createdMeeting),
            meetingsCreateDialogVisibleChangeRequest(false),
            snackbarsEnqueue({
              message: 'Meeting successfully created!',
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
              message: 'Meeting creation failed!',
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

interface ILoadMeetingsResponse {
  meetings: IMeeting[];
  count: number;
}

const loadMeetingsEpic: AppEpic = (action$, _, { axios }) =>
  action$.pipe(
    ofActionType(meetingsLoadMeetingsProposal),
    pluck('payload'),
    mergeMap(({ page }) =>
      fromAxios<ILoadMeetingsResponse>(axios, {
        url: '/meeting',
        method: 'GET',
        params: { page },
        withCredentials: true,
      }).pipe(
        mergeMap((response) => {
          if (!response.data.meetings.length) {
            return of(
              meetingsLoadMeetingsSuccess(
                response.data.meetings,
                response.data.count,
              ),
            );
          }
          return forkJoin(
            response.data.meetings.map((meeting) => geocodeIfPlaceId$(meeting)),
          ).pipe(
            map((meetings) =>
              meetingsLoadMeetingsSuccess(meetings, response.data.count),
            ),
          );
        }),
        catchError(() => of(meetingsLoadMeetingsFail())),
      ),
    ),
  );

const geocodeIfPlaceId$ = (meeting: IMeeting) => {
  if (!meeting.locationId) {
    return of(meeting);
  }
  return from(Geocoder.getPlaceById(meeting.locationId)).pipe(
    map((locationString) => ({
      ...meeting,
      locationString,
    })),
  );
};

export default combineEpics(createMeetingEpic, loadMeetingsEpic);

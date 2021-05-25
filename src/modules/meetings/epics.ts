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
  meetingsLoadMeetingRequest,
  meetingsLoadMeetingsFail,
  meetingsLoadMeetingsProposal,
  meetingsLoadMeetingsSuccess,
  meetingsLoadMeetingFail,
  meetingsChangeParticipantStatusProposal,
  meetingsChangeUserParticipationStatus,
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

interface ILoadMeetingResponse {
  meeting: IMeeting;
}

const loadMeetingEpic: AppEpic = (action$, _, { axios }) =>
  action$.pipe(
    ofActionType(meetingsLoadMeetingRequest),
    pluck('payload'),
    mergeMap(({ id }) =>
      fromAxios<ILoadMeetingResponse>(axios, {
        url: `/meeting/${id}`,
        method: 'GET',
        withCredentials: true,
      }).pipe(
        mergeMap((response) =>
          geocodeIfPlaceId$(response.data.meeting).pipe(
            map((meeting) => meetingsAddMeeting(meeting)),
          ),
        ),
        catchError(() => of(meetingsLoadMeetingFail())),
      ),
    ),
  );

const changeParticipationStatusEpic: AppEpic = (action$, _, { axios }) =>
  action$.pipe(
    ofActionType(meetingsChangeParticipantStatusProposal),
    pluck('payload'),
    mergeMap((participationStatusData) =>
      fromAxios(axios, {
        url: `/meeting/${participationStatusData.id}/status`,
        method: 'POST',
        data: {
          status: participationStatusData.status
        },
        withCredentials: true,
      }).pipe(
        mergeMap((response) =>
          of(
            meetingsChangeUserParticipationStatus(
              participationStatusData.id,
              participationStatusData.status,
              participationStatusData.userEmail
            ),
            snackbarsEnqueue({
              message: 'Successfully updated participation status!',
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
              message: 'Status change error!',
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

export default combineEpics(
  createMeetingEpic,
  loadMeetingsEpic,
  loadMeetingEpic,
  changeParticipationStatusEpic,
);

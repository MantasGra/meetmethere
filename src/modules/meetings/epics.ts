import { combineEpics } from 'redux-observable';
import { forkJoin, of, from, merge } from 'rxjs';
import {
  mergeMap,
  pluck,
  map,
  catchError,
  filter,
  withLatestFrom,
} from 'rxjs/operators';
import Geocoder from 'src/utils/Geocoder';
import {
  fromAxios,
  ofActionType,
  filterNotNullOrUndefined,
} from 'src/utils/operators';

import type { AppEpic } from '../app/epics';
import { snackbarsEnqueue } from '../snackbars/actions';

import {
  meetingsAddMeeting,
  meetingsCreateDialogVisibleChangeRequest,
  meetingsCreateMeetingProposal,
  meetingsLoadMeetingProposal,
  meetingsLoadMeetingsFail,
  meetingsLoadMeetingsProposal,
  meetingsLoadMeetingsSuccess,
  meetingsLoadMeetingFail,
  meetingsMeetingPollDatesResponseChangeRequest,
  meetingsMeetingPollDatesResponseChangeSuccess,
  meetingsMeetingPollDialogVisibleChangeRequest,
  meetingsChangeParticipantStatusProposal,
  meetingsChangeUserParticipationStatus,
  meetingsUpdateMeetingRequest,
  meetingsModifyMeeting,
  meetingsEditModeChange,
  meetingsRespondToCancelingMeeting,
  meetingsChangeCancelingMeeting,
} from './actions';
import {
  IMeeting,
  IMeetingDatesPollEntry,
  MeetingStatus,
  MeetingTypes,
} from './reducer';
import { meetingsCancelingMeetingSelector } from './selectors';

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
            meetingsAddMeeting(
              response.data.createdMeeting,
              MeetingTypes.Planned,
            ),
            meetingsCreateDialogVisibleChangeRequest(false),
            snackbarsEnqueue({
              message: 'Meeting successfully created!',
              options: {
                variant: 'success',
              },
            }),
          ),
        ),
        catchError(() =>
          of(
            snackbarsEnqueue({
              message: 'Meeting creation failed!',
              options: { variant: 'error' },
            }),
          ),
        ),
      ),
    ),
  );

const addPollResponseEpic: AppEpic = (action$, _, { axios }) =>
  action$.pipe(
    ofActionType(meetingsMeetingPollDatesResponseChangeRequest),
    pluck('payload'),
    mergeMap(({ votes, newMeetingDatesPollEntries, meetingId }) =>
      fromAxios<IMeetingDatesPollEntry[]>(axios, {
        url: `/meeting/${meetingId}/vote`,
        method: 'POST',
        data: { votes, newMeetingDatesPollEntries },
        withCredentials: true,
      }).pipe(
        mergeMap((response) =>
          of(
            meetingsMeetingPollDatesResponseChangeSuccess({
              entries: response.data,
              meetingId,
            }),
            meetingsMeetingPollDialogVisibleChangeRequest(null),
            snackbarsEnqueue({
              message: 'Thank you for your vote!',
              options: {
                variant: 'success',
              },
            }),
          ),
        ),
        catchError(() =>
          of(
            snackbarsEnqueue({
              message: 'Voting failed!',
              options: {
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
    mergeMap(({ page, typeOfMeeting }) =>
      fromAxios<ILoadMeetingsResponse>(axios, {
        url: '/meeting',
        method: 'GET',
        params: { page, typeOfMeeting },
        withCredentials: true,
      }).pipe(
        mergeMap((response) => {
          const { meetings, count } = response.data;
          if (!meetings.length) {
            return of(
              meetingsLoadMeetingsSuccess(meetings, count, typeOfMeeting),
            );
          }
          return forkJoin(
            meetings.map((meeting) => geocodeIfPlaceId$(meeting)),
          ).pipe(
            map((meetings) =>
              meetingsLoadMeetingsSuccess(meetings, count, typeOfMeeting),
            ),
          );
        }),
        catchError(() => of(meetingsLoadMeetingsFail(typeOfMeeting))),
      ),
    ),
  );

interface IGeocodeMeetingSlice {
  locationId?: string | null;
  locationString?: string | null;
}

const geocodeIfPlaceId$ = <M extends IGeocodeMeetingSlice>(meeting: M) => {
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
    ofActionType(meetingsLoadMeetingProposal),
    pluck('payload'),
    mergeMap((id) =>
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
    mergeMap(({ meetingId, userId, status }) =>
      fromAxios(axios, {
        url: `/meeting/${meetingId}/status`,
        method: 'POST',
        data: {
          status,
        },
        withCredentials: true,
      }).pipe(
        mergeMap(() =>
          of(
            meetingsChangeUserParticipationStatus(meetingId, userId, status),
            snackbarsEnqueue({
              message: 'Successfully updated participation status!',
              options: {
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
                variant: 'error',
              },
            }),
          ),
        ),
      ),
    ),
  );

interface IMeetingUpdateResponse {
  updatedMeeting: IMeeting;
}

const updateMeetingEpic: AppEpic = (action$, state$, { axios }) =>
  merge(
    action$.pipe(
      ofActionType(meetingsUpdateMeetingRequest),
      pluck('payload'),
      filter(
        ({ data }) =>
          ![MeetingStatus.Ended, MeetingStatus.Canceled].includes(data.status),
      ),
    ),
    action$.pipe(
      ofActionType(meetingsRespondToCancelingMeeting),
      pluck('payload'),
      filter((confirmed) => confirmed),
      withLatestFrom(state$),
      map(([, state]) => meetingsCancelingMeetingSelector(state)),
      filterNotNullOrUndefined(),
    ),
  ).pipe(
    mergeMap(({ meetingId, data }) =>
      fromAxios<IMeetingUpdateResponse>(axios, {
        url: `/meeting/${meetingId}`,
        method: 'PATCH',
        data,
        withCredentials: true,
      }).pipe(
        mergeMap((response) =>
          geocodeIfPlaceId$(response.data.updatedMeeting).pipe(
            mergeMap((meeting) =>
              of(
                meetingsModifyMeeting(meetingId, meeting),
                meetingsEditModeChange(null),
                snackbarsEnqueue({
                  message: 'Meeting updated!',
                  options: {
                    variant: 'success',
                  },
                }),
              ),
            ),
          ),
        ),
        catchError(() =>
          of(
            snackbarsEnqueue({
              message: 'Something went wrong. Meeting update failed!',
              options: {
                variant: 'error',
              },
            }),
          ),
        ),
      ),
    ),
  );

const cancelingMeetingEpic: AppEpic = (action$) =>
  merge(
    action$.pipe(
      ofActionType(meetingsRespondToCancelingMeeting),
      pluck('payload'),
      filter((confirmed) => !confirmed),
      map(() => null),
    ),
    action$.pipe(
      ofActionType(meetingsUpdateMeetingRequest),
      pluck('payload'),
      filter(({ data }) =>
        [MeetingStatus.Ended, MeetingStatus.Canceled].includes(data.status),
      ),
    ),
  ).pipe(map((value) => meetingsChangeCancelingMeeting(value)));

export default combineEpics(
  createMeetingEpic,
  loadMeetingsEpic,
  loadMeetingEpic,
  addPollResponseEpic,
  changeParticipationStatusEpic,
  updateMeetingEpic,
  cancelingMeetingEpic,
);

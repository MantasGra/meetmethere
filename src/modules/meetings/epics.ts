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
  meetingsLoadMeetingRequest,
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
  IUpdateMeetingRequest,
  meetingsModifyMeeting,
  meetingsEditModeChange,
  meetingsRespondToCancelingMeeting,
  meetingsChangeCancelingMeeting,
} from './actions';
import { IMeeting, IMeetingDatesPollEntry, MeetingStatus } from './reducer';
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
                key: new Date().getTime() + Math.random(),
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
    mergeMap(({ page, typeOfMeeting }) =>
      fromAxios<ILoadMeetingsResponse>(axios, {
        url: '/meeting',
        method: 'GET',
        params: { page, typeOfMeeting },
        withCredentials: true,
      }).pipe(
        mergeMap((response) => {
          if (!response.data.meetings.length) {
            return of(
              meetingsLoadMeetingsSuccess(
                response.data.meetings,
                response.data.count,
                typeOfMeeting,
              ),
            );
          }
          return forkJoin(
            response.data.meetings.map((meeting) => geocodeIfPlaceId$(meeting)),
          ).pipe(
            map((meetings) =>
              meetingsLoadMeetingsSuccess(
                meetings,
                response.data.count,
                typeOfMeeting,
              ),
            ),
          );
        }),
        catchError(() => of(meetingsLoadMeetingsFail())),
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
          status: participationStatusData.status,
        },
        withCredentials: true,
      }).pipe(
        mergeMap(() =>
          of(
            meetingsChangeUserParticipationStatus(
              participationStatusData.id,
              participationStatusData.status,
              participationStatusData.userEmail,
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

interface IMeetingUpdateResponse
  extends Omit<IUpdateMeetingRequest, 'startDate' | 'endDate'> {
  id: number;
  startDate?: Date;
  endDate?: Date;
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
          geocodeIfPlaceId$(response.data).pipe(
            mergeMap((meeting) =>
              of(
                meetingsModifyMeeting(meeting),
                meetingsEditModeChange(null),
                snackbarsEnqueue({
                  message: 'Meeting updated!',
                  options: {
                    key: new Date().getTime() + Math.random(),
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
                key: new Date().getTime() + Math.random(),
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

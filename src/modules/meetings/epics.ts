import { combineEpics } from 'redux-observable';
import { of } from 'rxjs';
import { mergeMap, pluck, map, catchError } from 'rxjs/operators';
import { fromAxios, ofActionType } from 'src/utils/operators';
import type { AppEpic } from '../app/epics';
import { snackbarsEnqueue } from '../snackbars/actions';
import {
  meetingsAddMeeting,
  meetingsCreateDialogVisibleChangeRequest,
  meetingsCreateMeetingProposal,
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
  meetings: [IMeeting[], number];
}

const loadMeetingsEpic: AppEpic = (action$, _, { axios }) =>
  action$.pipe(
    ofActionType(meetingsLoadMeetingsProposal),
    mergeMap(() =>
      fromAxios<ILoadMeetingsResponse>(axios, {
        url: '/meeting',
        method: 'GET',
        params: { page: 1 },
        withCredentials: true,
      }).pipe(
        map((response) =>
          meetingsLoadMeetingsSuccess(response.data.meetings[0]),
        ),
      ),
    ),
  );

export default combineEpics(createMeetingEpic, loadMeetingsEpic);

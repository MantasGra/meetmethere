import { combineEpics } from 'redux-observable';
import { of } from 'rxjs';
import { mergeMap, pluck, map, catchError } from 'rxjs/operators';
import { fromAxios, ofActionType } from 'src/utils/operators';

import type { AppEpic } from '../app/epics';
import type { IParticipant } from '../auth/reducer';
import { meetingsAddUsersToMeeting } from '../meetings/actions';
import type { IMeeting } from '../meetings/reducer';
import { snackbarsEnqueue } from '../snackbars/actions';

import {
  invitationsLoadInvitationsFail,
  invitationsLoadInvitationsProposal,
  invitationsLoadInvitationsSuccess,
  invitationsInviteUsersToMeeting,
  invitationsInviteUserDialogOpenRequest,
} from './actions';

interface ILoadInvitationsResponse {
  invitations: IMeeting[];
}

const loadInvitationsEpic: AppEpic = (action$, _, { axios }) =>
  action$.pipe(
    ofActionType(invitationsLoadInvitationsProposal),
    pluck('payload'),
    mergeMap(() =>
      fromAxios<ILoadInvitationsResponse>(axios, {
        url: '/meeting/invitations',
        method: 'GET',
        withCredentials: true,
      }).pipe(
        map((response) =>
          invitationsLoadInvitationsSuccess(response.data.invitations),
        ),
        catchError(() => of(invitationsLoadInvitationsFail())),
      ),
    ),
  );

interface IInviteToMeetingResponse {
  newParticipants: IParticipant[];
}

const inviteToMeetingEpic: AppEpic = (action$, _, { axios }) =>
  action$.pipe(
    ofActionType(invitationsInviteUsersToMeeting),
    pluck('payload'),
    mergeMap(({ meetingId, newUserIds }) =>
      fromAxios<IInviteToMeetingResponse>(axios, {
        url: `/meeting/${meetingId}/invite`,
        method: 'POST',
        withCredentials: true,
        data: {
          userIds: newUserIds,
        },
      }).pipe(
        mergeMap((response) =>
          of(
            meetingsAddUsersToMeeting(meetingId, response.data.newParticipants),
            invitationsInviteUserDialogOpenRequest(null),
            snackbarsEnqueue({
              message: 'Invitations sent!',
              options: {
                variant: 'success',
              },
            }),
          ),
        ),
        catchError(() =>
          of(
            snackbarsEnqueue({
              message: 'Something went wrong!',
              options: {
                variant: 'error',
              },
            }),
          ),
        ),
      ),
    ),
  );

export default combineEpics(loadInvitationsEpic, inviteToMeetingEpic);

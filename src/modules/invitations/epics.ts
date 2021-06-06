import { combineEpics } from 'redux-observable';
import { of } from 'rxjs';
import { mergeMap, pluck, map, catchError } from 'rxjs/operators';
import { fromAxios, ofActionType } from 'src/utils/operators';
import type { AppEpic } from '../app/epics';
import type { IUserInvitation } from '../auth/reducer';
import { meetingsAddUsersToMeeting } from '../meetings/actions';
import { snackbarsEnqueue } from '../snackbars/actions';
import {
  invitationsLoadInvitationsFail,
  invitationsLoadInvitationsProposal,
  invitationsLoadInvitationsSuccess,
  invitationsInviteUsersToMeeting,
  invitationsInviteUserDialogOpenRequest,
} from './actions';
import type { IInvitation } from './reducer';

const loadInvitationsEpic: AppEpic = (action$, _, { axios }) =>
  action$.pipe(
    ofActionType(invitationsLoadInvitationsProposal),
    pluck('payload'),
    mergeMap(() =>
      fromAxios<IInvitation[]>(axios, {
        url: '/meeting/invitations',
        method: 'GET',
        withCredentials: true,
      }).pipe(
        map((response) => invitationsLoadInvitationsSuccess(response.data)),
        catchError(() => of(invitationsLoadInvitationsFail())),
      ),
    ),
  );

const inviteToMeetingEpic: AppEpic = (action$, _, { axios }) =>
  action$.pipe(
    ofActionType(invitationsInviteUsersToMeeting),
    pluck('payload'),
    mergeMap(({ meetingId, newUserIds }) =>
      fromAxios<IUserInvitation[]>(axios, {
        url: `/meeting/${meetingId}/invite`,
        method: 'POST',
        withCredentials: true,
        data: {
          userIds: newUserIds,
        },
      }).pipe(
        mergeMap((response) =>
          of(
            meetingsAddUsersToMeeting(meetingId, response.data),
            invitationsInviteUserDialogOpenRequest(null),
            snackbarsEnqueue({
              message: 'Invitations sent!',
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
              message: 'Something went wrong!',
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

export default combineEpics(loadInvitationsEpic, inviteToMeetingEpic);

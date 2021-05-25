import { combineEpics } from 'redux-observable';
import { forkJoin, of, from } from 'rxjs';
import { mergeMap, pluck, map, catchError } from 'rxjs/operators';
import { fromAxios, ofActionType } from 'src/utils/operators';
import type { AppEpic } from '../app/epics';
import {
  invitationsLoadInvitationsFail,
  invitationsLoadInvitationsProposal,
  invitationsLoadInvitationsSuccess,
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

export default combineEpics(loadInvitationsEpic);

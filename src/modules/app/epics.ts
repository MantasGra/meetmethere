import { combineEpics } from 'redux-observable';
import type { Epic } from 'redux-observable';
import { from } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { ofActionType } from 'src/utils/operators';

import activityEpics from '../activitites/epics';
import announcementEpics from '../announcements/epics';
import {
  authGetCsrfTokenRequest,
  authAuthorizeUserProposal,
} from '../auth/actions';
import authEpics from '../auth/epics';
import expenseEpics from '../expenses/epics';
import invitationEpics from '../invitations/epics';
import meetingEpics from '../meetings/epics';

import { AppActions, appInit, appInitSuccess } from './actions';
import type { RootState } from './reducer';
import type { AppDeps } from './store';

export type AppEpic = Epic<AppActions, AppActions, RootState, AppDeps>;

const appInitEpic: AppEpic = (action$) =>
  action$.pipe(
    ofActionType(appInit),
    mergeMap(() =>
      from([
        authGetCsrfTokenRequest(),
        authAuthorizeUserProposal(),
        appInitSuccess(),
      ]),
    ),
  );

const rootEpic: AppEpic = (action$, store$, dependencies) =>
  combineEpics<AppActions, AppActions, RootState, AppDeps>(
    appInitEpic,
    authEpics,
    meetingEpics,
    announcementEpics,
    expenseEpics,
    activityEpics,
    invitationEpics,
  )(action$, store$, dependencies).pipe(
    catchError((error, source) => {
      console.error(error);
      return source;
    }),
  );

export default rootEpic;

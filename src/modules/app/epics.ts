import { combineEpics } from 'redux-observable';
import type { Epic } from 'redux-observable';
import { catchError, mergeMap } from 'rxjs/operators';
import { from } from 'rxjs';
import { ofActionType } from 'src/utils/operators';
import { AppActions, appInit, appInitSuccess } from './actions';
import type { RootState } from './reducer';
import type { AppDeps } from './store';

import authEpics from '../auth/epics';
import meetingEpics from '../meetings/epics';
import announcementEpics from '../announcements/epics';
import activityEpics from '../activitites/epics';
import { authAuthorizeUserProposal } from '../auth/actions';

export type AppEpic = Epic<AppActions, AppActions, RootState, AppDeps>;

const appInitEpic: AppEpic = (action$) =>
  action$.pipe(
    ofActionType(appInit),
    mergeMap(() => from([authAuthorizeUserProposal(), appInitSuccess()])),
  );

const rootEpic: AppEpic = (action$, store$, dependencies) =>
  combineEpics<AppActions, AppActions, RootState, AppDeps>(
    appInitEpic,
    authEpics,
    meetingEpics,
    announcementEpics,
    activityEpics,
  )(action$, store$, dependencies).pipe(
    catchError((error, source) => {
      console.error(error);
      return source;
    }),
  );

export default rootEpic;

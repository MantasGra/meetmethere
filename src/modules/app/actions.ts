import { PayloadActionCreator, Action, createAction } from '@reduxjs/toolkit';
import type { AuthActions } from '../auth/actions';
import type { SnackbarsActions } from '../snackbars/actions';
import type { MeetingsActions } from '../meetings/actions';
import type { AnnouncementsActions } from '../announcements/actions';
import type { ActivitiesActions } from '../activitites/actions';
import type { ExpensesActions } from '../expenses/actions';

export const withPayloadType = <T>() => {
  return (t: T): { payload: T } => ({ payload: t });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const multipleActionsMatcher = <PAC extends PayloadActionCreator<any>>(
  actions: PAC[],
) => (action: Action<unknown>): action is ReturnType<PAC> => {
  for (let i = 0; i < actions.length; i++) {
    if (actions[i].match(action)) {
      return true;
    }
  }
  return false;
};

export const appInit = createAction('app/init');

export const appInitSuccess = createAction('app/initSuccess');

export const openMobileMenu = createAction(
  'app/openMobileMenu',
  withPayloadType<boolean>(),
);

export type AppActions =
  | ReturnType<typeof appInit>
  | ReturnType<typeof appInitSuccess>
  | ReturnType<typeof openMobileMenu>
  | AuthActions
  | SnackbarsActions
  | MeetingsActions
  | AnnouncementsActions
  | ActivitiesActions
  | ExpensesActions;

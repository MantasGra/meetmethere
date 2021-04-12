import { PayloadActionCreator, Action, createAction } from '@reduxjs/toolkit';
import type { AuthActions } from '../auth/actions';
import type { SnackbarsActions } from '../snackbars/actions';

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

export type AppActions =
  | ReturnType<typeof appInit>
  | AuthActions
  | SnackbarsActions;

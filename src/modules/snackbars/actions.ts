import { createAction } from '@reduxjs/toolkit';
import type { SnackbarKey } from 'notistack';
import { withPayloadType } from '../app/actions';
import type { Notification } from './reducer';

export const snackbarsEnqueue = createAction(
  'snackbars/enqueue',
  (notification: Partial<Notification>) => {
    const key = notification.options && notification.options.key;
    const options = notification.options || {};
    const message = notification.message || '';
    return {
      payload: {
        dismissed: !!notification.dismissed,
        message,
        options,
        key: key || new Date().getTime() + Math.random(),
      },
    };
  },
);

export const snackbarsClose = createAction(
  'snackbars/close',
  (key?: SnackbarKey) => ({ payload: { dismissAll: !key, key } }),
);

export const snackbarsRemove = createAction(
  'snackbars/remove',
  withPayloadType<SnackbarKey>(),
);

export type SnackbarsActions =
  | ReturnType<typeof snackbarsEnqueue>
  | ReturnType<typeof snackbarsClose>
  | ReturnType<typeof snackbarsRemove>;

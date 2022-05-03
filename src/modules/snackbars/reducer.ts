import { createReducer } from '@reduxjs/toolkit';
import type { SnackbarMessage, OptionsObject, SnackbarKey } from 'notistack';

import { snackbarsClose, snackbarsEnqueue, snackbarsRemove } from './actions';

export interface Notification {
  message: SnackbarMessage;
  options: OptionsObject;
  key: SnackbarKey;
  dismissed: boolean;
}

interface SnackbarsState {
  notifications: Notification[];
}

const initialState: SnackbarsState = {
  notifications: [],
};

const snackbarsReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(snackbarsEnqueue, (state, action) => ({
      ...state,
      notifications: [...state.notifications, action.payload],
    }))
    .addCase(snackbarsClose, (state, action) => ({
      ...state,
      notifications: state.notifications.map((notification) =>
        action.payload.dismissAll || action.payload.key === notification.key
          ? { ...notification, dismissed: true }
          : { ...notification },
      ),
    }))
    .addCase(snackbarsRemove, (state, action) => ({
      ...state,
      notifications: state.notifications.filter(
        (notification) => notification.key !== action.payload,
      ),
    })),
);

export default snackbarsReducer;

import type { RootState } from '../app/reducer';

import type { Notification } from './reducer';

export const notificationsSelector = (state: RootState): Notification[] =>
  state.snackbars.notifications;

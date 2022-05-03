import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from 'src/modules/app/reducer';

import type { AuthState } from './reducer';

export const authStateSelector = (state: RootState): AuthState => state.auth;

export const isAuthDialogOpenSelector = createSelector(
  authStateSelector,
  (authState) => authState.isAuthDialogOpen,
);

export const isAuthDialogRegisterSelector = createSelector(
  authStateSelector,
  (authState) => authState.isDialogRegister,
);

export const authStateAccountSelector = createSelector(
  authStateSelector,
  (authState) => authState.account,
);

export const isUserLoggedInSelector = createSelector(
  authStateAccountSelector,
  (account) => !!account,
);

export const accountEmailSelector = createSelector(
  authStateAccountSelector,
  (account) => account?.email || '',
);

interface NamedEntity {
  name: string;
  lastName: string;
}

export const getFullName = (user?: NamedEntity) =>
  `${user?.name || ''} ${user?.lastName || ''}`;

export const accountFullNameSelector = createSelector(
  authStateAccountSelector,
  getFullName,
);

export const authFormErrorsSelector = createSelector(
  authStateSelector,
  (authState) => authState.formErrors,
);

export const authLoadingSelector = createSelector(
  authStateSelector,
  (authState) => authState.authLoading,
);

export const authCurrentUserIdSelector = createSelector(
  authStateAccountSelector,
  (account) => account?.id,
);

export const accountColorSelector = createSelector(
  authStateAccountSelector,
  (account) => account?.color || '',
);

export const getUserInitials = (user?: NamedEntity) =>
  `${user?.name.charAt(0) || ''}${user?.lastName.charAt(0) || ''}`;

export const accountInitialsSelector = createSelector(
  authStateAccountSelector,
  getUserInitials,
);

export const accountAvatarDataSelector = createSelector(
  accountColorSelector,
  accountInitialsSelector,
  (color, accountInitials) => ({ color, accountInitials }),
);

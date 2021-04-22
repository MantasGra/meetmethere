import type { RootState } from 'src/modules/app/reducer';
import type { IFormError } from './reducer';

export const isAuthDialogOpenSelector = (state: RootState): boolean =>
  state.auth.isAuthDialogOpen;

export const isAuthDialogRegisterSelector = (state: RootState): boolean =>
  state.auth.isDialogRegister;

export const isUserLoggedInSelector = (state: RootState): boolean =>
  !!state.auth.account;

export const accountEmailSelector = (state: RootState): string =>
  state.auth.account?.email || '';

export const accountFullNameSelector = (state: RootState): string =>
  `${state.auth.account?.name || ''} ${state.auth.account?.lastName || ''}`;

export const authFormErrorsSelector = (state: RootState): IFormError =>
  state.auth.formErrors;

export const authLoadingSelector = (state: RootState): boolean =>
  state.auth.authLoading;

interface IAccountAvatarData {
  color: string;
  accountInitials: string;
}

export const accountAvatarDataSelector = (
  state: RootState,
): IAccountAvatarData => ({
  color: state.auth.account?.color || '',
  accountInitials: `${state.auth.account?.name.charAt(0) || ''}${
    state.auth.account?.lastName.charAt(0) || ''
  }`,
});

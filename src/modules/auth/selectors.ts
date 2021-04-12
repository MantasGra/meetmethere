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

export const authFormErrorsSelector = (state: RootState): IFormError =>
  state.auth.formErrors;

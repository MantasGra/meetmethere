import { createAction } from '@reduxjs/toolkit';

import { withPayloadType } from '../app/actions';

import { IChangePasswordForm } from './components/ChangePasswordForm';
import type { ILoginForm } from './components/LoginForm';
import type { IRegisterForm } from './components/RegisterForm';
import { IRequestPasswordResetForm } from './components/RequestPasswordResetForm';
import { IResetPasswordForm } from './components/ResetPasswordForm';
import {
  AuthDialogType,
  IAccount,
  IChangePasswordError,
  IFormError,
  IResetPasswordError,
} from './reducer';

export const authAuthorizeUserProposal = createAction(
  'auth/authorizeUserProposal',
);
export const authGetCsrfTokenRequest = createAction('auth/getCsrfTokenRequest');
export const authSetCsrfTokenRequest = createAction(
  'auth/setCsrfTokenRequest',
  withPayloadType<string>(),
);
export const authSetAuthLoading = createAction(
  'auth/setAuthLoading',
  withPayloadType<boolean>(),
);
export const authAuthorizeUserRequest = createAction(
  'auth/authorizeUserRequest',
  withPayloadType<IAccount>(),
);
export const authLoginDialogVisibleChangeRequest = createAction(
  'auth/loginDialogVisibleChangeRequest',
  withPayloadType<boolean>(),
);
export const authDialogTypeChangeRequest = createAction(
  'auth/isDialogRegisterChangeRequest',
  withPayloadType<AuthDialogType>(),
);
export const authOpenLoginProposal = createAction('auth/openLogin');
export const authSwitchToLoginProposal = createAction(
  'auth/switchToLoginProposal',
);
export const authSwitchToRegisterProposal = createAction(
  'auth/switchToRegisterProposal',
);
export const authLoginSubmitProposal = createAction(
  'auth/loginSubmitProposal',
  withPayloadType<ILoginForm>(),
);
export const authRegisterSubmitProposal = createAction(
  'auth/registerSubmitProposal',
  withPayloadType<IRegisterForm>(),
);
export const authChangeSubmitErrorRequest = createAction(
  'auth/changeSubmitErrorRequest',
  withPayloadType<IFormError>(),
);
export const authLogoutProposal = createAction('auth/logoutProposal');
export const authLogoutRequest = createAction('auth/logoutRequest');

export const authChangePasswordDialogVisibleChangeRequest = createAction(
  'auth/changePasswordDialogVisibleChangeRequest',
  withPayloadType<boolean>(),
);

export const authChangePasswordSubmitProposal = createAction(
  'auth/changePasswordSubmitProposal',
  withPayloadType<Omit<IChangePasswordForm, 'newPasswordRepeat'>>(),
);

export const authChangePasswordChangeErrors = createAction(
  'auth/changePasswordChangeErrors',
  withPayloadType<IChangePasswordError>(),
);

export const authRequestPasswordResetProposal = createAction(
  'auth/requestPasswordResetProposal',
  withPayloadType<IRequestPasswordResetForm>(),
);

export const authSwitchToPasswordResetProposal = createAction(
  'auth/switchToPasswordResetPropsoal',
);

export const authResetPasswordProposal = createAction(
  'auth/resetPasswordProposal',
  withPayloadType<Omit<IResetPasswordForm, 'passwordRepeat'>>(),
);

export const authResetPasswordErrorsChange = createAction(
  'auth/resetPasswordErrorsChange',
  withPayloadType<IResetPasswordError>(),
);

export type AuthActions =
  | ReturnType<typeof authAuthorizeUserProposal>
  | ReturnType<typeof authGetCsrfTokenRequest>
  | ReturnType<typeof authSetCsrfTokenRequest>
  | ReturnType<typeof authSetAuthLoading>
  | ReturnType<typeof authAuthorizeUserRequest>
  | ReturnType<typeof authLoginDialogVisibleChangeRequest>
  | ReturnType<typeof authDialogTypeChangeRequest>
  | ReturnType<typeof authOpenLoginProposal>
  | ReturnType<typeof authSwitchToLoginProposal>
  | ReturnType<typeof authSwitchToRegisterProposal>
  | ReturnType<typeof authLoginSubmitProposal>
  | ReturnType<typeof authRegisterSubmitProposal>
  | ReturnType<typeof authChangeSubmitErrorRequest>
  | ReturnType<typeof authLogoutProposal>
  | ReturnType<typeof authLogoutRequest>
  | ReturnType<typeof authChangePasswordDialogVisibleChangeRequest>
  | ReturnType<typeof authChangePasswordSubmitProposal>
  | ReturnType<typeof authChangePasswordChangeErrors>
  | ReturnType<typeof authRequestPasswordResetProposal>
  | ReturnType<typeof authSwitchToPasswordResetProposal>
  | ReturnType<typeof authResetPasswordProposal>
  | ReturnType<typeof authResetPasswordErrorsChange>;

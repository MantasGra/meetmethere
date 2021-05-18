import { createAction } from '@reduxjs/toolkit';
import { withPayloadType } from '../app/actions';
import type { IAccount, IFormError } from './reducer';
import type { ILoginForm } from './components/LoginForm';
import type { IRegisterForm } from './components/RegisterForm';

export const authAuthorizeUserProposal = createAction(
  'auth/authorizeUserProposal',
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
export const authIsDialogRegisterChangeRequest = createAction(
  'auth/isDialogRegisterChangeRequest',
  withPayloadType<boolean>(),
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

export type AuthActions =
  | ReturnType<typeof authAuthorizeUserProposal>
  | ReturnType<typeof authSetAuthLoading>
  | ReturnType<typeof authAuthorizeUserRequest>
  | ReturnType<typeof authLoginDialogVisibleChangeRequest>
  | ReturnType<typeof authIsDialogRegisterChangeRequest>
  | ReturnType<typeof authOpenLoginProposal>
  | ReturnType<typeof authSwitchToLoginProposal>
  | ReturnType<typeof authSwitchToRegisterProposal>
  | ReturnType<typeof authLoginSubmitProposal>
  | ReturnType<typeof authRegisterSubmitProposal>
  | ReturnType<typeof authChangeSubmitErrorRequest>
  | ReturnType<typeof authLogoutProposal>
  | ReturnType<typeof authLogoutRequest>;

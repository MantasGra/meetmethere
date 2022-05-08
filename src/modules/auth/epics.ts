import type { AxiosError } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { combineEpics } from 'redux-observable';
import { EMPTY, from, of } from 'rxjs';
import {
  mergeMap,
  withLatestFrom,
  catchError,
  pluck,
  map,
  tap,
} from 'rxjs/operators';
import { Routes } from 'src/constants/enums';
import { fromAxios, ofActionType } from 'src/utils/operators';

import type { AppEpic } from '../app/epics';
import { isMobileSelector } from '../app/selectors';
import { snackbarsEnqueue } from '../snackbars/actions';

import {
  authAuthorizeUserProposal,
  authAuthorizeUserRequest,
  authDialogTypeChangeRequest,
  authLoginDialogVisibleChangeRequest,
  authOpenLoginProposal,
  authSwitchToLoginProposal,
  authSwitchToRegisterProposal,
  authLoginSubmitProposal,
  authChangeSubmitErrorRequest,
  authLogoutRequest,
  authLogoutProposal,
  authRegisterSubmitProposal,
  authSetAuthLoading,
  authGetCsrfTokenRequest,
  authSetCsrfTokenRequest,
  authChangePasswordSubmitProposal,
  authChangePasswordDialogVisibleChangeRequest,
  authChangePasswordChangeErrors,
  authRequestPasswordResetProposal,
  authSwitchToPasswordResetProposal,
  authResetPasswordProposal,
  authResetPasswordErrorsChange,
} from './actions';
import { AuthDialogType, IAccount } from './reducer';
import { isAuthDialogOpenSelector } from './selectors';

export const openLoginEpic: AppEpic = (action$, state$, { history }) =>
  action$.pipe(
    ofActionType(authOpenLoginProposal),
    withLatestFrom(state$),
    mergeMap(([, state]) => {
      const isMobile = isMobileSelector(state);
      if (isMobile) {
        history.push(Routes.Login);
        return EMPTY;
      }
      return of(authLoginDialogVisibleChangeRequest(true));
    }),
  );

export const switchToLoginEpic: AppEpic = (action$, state$, { history }) =>
  action$.pipe(
    ofActionType(authSwitchToLoginProposal),
    withLatestFrom(state$),
    mergeMap(([, state]) => {
      const isDialog = isAuthDialogOpenSelector(state);
      if (!isDialog) {
        history.push(Routes.Login);
        return EMPTY;
      }
      return of(authDialogTypeChangeRequest(AuthDialogType.Login));
    }),
  );

export const switchToRegisterEpic: AppEpic = (action$, state$, { history }) =>
  action$.pipe(
    ofActionType(authSwitchToRegisterProposal),
    withLatestFrom(state$),
    mergeMap(([, state]) => {
      const isDialog = isAuthDialogOpenSelector(state);
      if (!isDialog) {
        history.push(Routes.Register);
        return EMPTY;
      }
      return of(authDialogTypeChangeRequest(AuthDialogType.Register));
    }),
  );

export const switchToPasswordResetEpic: AppEpic = (
  action$,
  state$,
  { history },
) =>
  action$.pipe(
    ofActionType(authSwitchToPasswordResetProposal),
    withLatestFrom(state$),
    mergeMap(([, state]) => {
      const isDialog = isAuthDialogOpenSelector(state);
      if (!isDialog) {
        history.push(Routes.RequestPasswordReset);
        return EMPTY;
      }
      return of(authDialogTypeChangeRequest(AuthDialogType.ResetPassword));
    }),
  );

const authorizeUserEpic: AppEpic = (action$, _, { axios }) =>
  action$.pipe(
    ofActionType(authAuthorizeUserProposal),
    mergeMap(() =>
      fromAxios<IAccount>(axios, {
        url: '/user/self',
        withCredentials: true,
      }).pipe(
        mergeMap((response) => of(authAuthorizeUserRequest(response.data))),
        catchError(() => {
          return of(authSetAuthLoading(false));
        }),
      ),
    ),
  );

const registerSubmitEpic: AppEpic = (action$, state$, { axios, history }) =>
  action$.pipe(
    ofActionType(authRegisterSubmitProposal),
    pluck('payload'),
    withLatestFrom(state$),
    mergeMap(([formData, state]) =>
      fromAxios(axios, {
        url: '/auth/register',
        method: 'POST',
        data: formData,
        withCredentials: true,
      }).pipe(
        mergeMap(() => {
          const isDialog = isAuthDialogOpenSelector(state);
          const outputActions = [];
          if (isDialog) {
            outputActions.push(
              authDialogTypeChangeRequest(AuthDialogType.Login),
            );
          } else {
            history.push(Routes.Login);
          }
          return from([
            ...outputActions,
            snackbarsEnqueue({
              message: 'Account successfully created!',
              options: {
                variant: 'success',
              },
            }),
          ]);
        }),
        catchError((error: AxiosError<string>) => {
          if (error.response?.status === StatusCodes.BAD_REQUEST) {
            return of(
              authChangeSubmitErrorRequest({ email: error.response?.data }),
            );
          }
          return of(
            authChangeSubmitErrorRequest({ overall: 'Something went wrong.' }),
          );
        }),
      ),
    ),
  );

const loginSubmitEpic: AppEpic = (action$, state$, { axios, history }) =>
  action$.pipe(
    ofActionType(authLoginSubmitProposal),
    pluck('payload'),
    withLatestFrom(state$),
    mergeMap(([formData, state]) =>
      fromAxios(axios, {
        url: '/auth/login',
        method: 'POST',
        data: formData,
        withCredentials: true,
      }).pipe(
        mergeMap(() => {
          const isDialog = isAuthDialogOpenSelector(state);
          const outputActions = [];
          if (isDialog) {
            outputActions.push(authLoginDialogVisibleChangeRequest(false));
          } else {
            history.push(Routes.Home);
          }
          return from([...outputActions, authAuthorizeUserProposal()]);
        }),
        catchError((error: AxiosError) => {
          let errorMessage = 'Something went wrong.';
          if (error.response?.status === StatusCodes.UNAUTHORIZED) {
            errorMessage = 'Invalid credentials.';
          }
          return of(authChangeSubmitErrorRequest({ overall: errorMessage }));
        }),
      ),
    ),
  );

const logoutEpic: AppEpic = (action$, _, { axios }) =>
  action$.pipe(
    ofActionType(authLogoutProposal),
    mergeMap(() =>
      fromAxios(axios, {
        url: '/auth/logout',
        method: 'POST',
        withCredentials: true,
      }).pipe(mergeMap(() => of(authLogoutRequest()))),
    ),
  );

interface IGetCsrfTokenResponse {
  csrfToken: string;
}

const getCsrfTokenEpic: AppEpic = (action$, _, { axios }) =>
  action$.pipe(
    ofActionType(authGetCsrfTokenRequest),
    mergeMap(() =>
      fromAxios<IGetCsrfTokenResponse>(axios, {
        url: '/csrf',
        method: 'GET',
        withCredentials: true,
      }).pipe(
        tap((response) => {
          axios.defaults.headers.common['CSRF-Token'] = response.data.csrfToken;
        }),
        map((response) => authSetCsrfTokenRequest(response.data.csrfToken)),
      ),
    ),
  );

const changePasswordEpic: AppEpic = (action$, _, { axios }) =>
  action$.pipe(
    ofActionType(authChangePasswordSubmitProposal),
    pluck('payload'),
    mergeMap((formData) =>
      fromAxios(axios, {
        url: '/auth/changepassword',
        method: 'POST',
        data: formData,
        withCredentials: true,
      }).pipe(
        mergeMap(() =>
          from([
            authChangePasswordDialogVisibleChangeRequest(false),
            snackbarsEnqueue({
              message: 'Password successfully changed!',
              options: { variant: 'success' },
            }),
          ]),
        ),
        catchError((error: AxiosError) => {
          let errorMessage = 'Something went wrong.';
          if (error.response?.status === StatusCodes.UNAUTHORIZED) {
            errorMessage = 'Incorrect password.';
          }
          return of(
            authChangePasswordChangeErrors({ oldPassword: errorMessage }),
          );
        }),
      ),
    ),
  );

const requestPasswordResetEpic: AppEpic = (
  action$,
  state$,
  { axios, history },
) =>
  action$.pipe(
    ofActionType(authRequestPasswordResetProposal),
    pluck('payload'),
    withLatestFrom(state$),
    mergeMap(([formData, state]) =>
      fromAxios(axios, {
        url: '/auth/requestpasswordreset',
        method: 'POST',
        data: formData,
        withCredentials: true,
      }).pipe(
        mergeMap(() => {
          const isDialog = isAuthDialogOpenSelector(state);
          const outputActions = [];
          if (isDialog) {
            outputActions.push(authLoginDialogVisibleChangeRequest(false));
          } else {
            history.push(Routes.Home);
          }
          return from([
            ...outputActions,
            snackbarsEnqueue({
              message:
                'If the account is registered with us a password reset email was sent.',
              options: {
                variant: 'success',
              },
            }),
          ]);
        }),
        catchError(() =>
          of(
            authChangeSubmitErrorRequest({ overall: 'Something went wrong.' }),
          ),
        ),
      ),
    ),
  );

const passwordResetEpic: AppEpic = (action$, _, { axios, history }) =>
  action$.pipe(
    ofActionType(authResetPasswordProposal),
    pluck('payload'),
    mergeMap((formData) =>
      fromAxios(axios, {
        url: '/auth/resetpassword',
        method: 'POST',
        data: formData,
        withCredentials: true,
      }).pipe(
        map(() => {
          history.push(Routes.Home);
          return snackbarsEnqueue({
            message: 'Your password was reset.',
            options: { variant: 'success' },
          });
        }),
        catchError((error: AxiosError) => {
          if (
            error.response?.status === StatusCodes.BAD_REQUEST ||
            error.response?.status === StatusCodes.NOT_FOUND
          ) {
            return of(
              authResetPasswordErrorsChange({
                overall:
                  'The reset request is invalid. Please try to request a password reset again.',
              }),
            );
          }
          return of(
            authResetPasswordErrorsChange({ overall: 'Something went wrong.' }),
          );
        }),
      ),
    ),
  );

export default combineEpics(
  openLoginEpic,
  switchToLoginEpic,
  switchToRegisterEpic,
  switchToPasswordResetEpic,
  authorizeUserEpic,
  registerSubmitEpic,
  loginSubmitEpic,
  logoutEpic,
  getCsrfTokenEpic,
  changePasswordEpic,
  requestPasswordResetEpic,
  passwordResetEpic,
);

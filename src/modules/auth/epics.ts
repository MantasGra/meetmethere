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
  authIsDialogRegisterChangeRequest,
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
} from './actions';
import type { IAccount } from './reducer';
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
      return of(authIsDialogRegisterChangeRequest(false));
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
      return of(authIsDialogRegisterChangeRequest(true));
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
            outputActions.push(authIsDialogRegisterChangeRequest(false));
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

export default combineEpics(
  openLoginEpic,
  switchToLoginEpic,
  switchToRegisterEpic,
  authorizeUserEpic,
  registerSubmitEpic,
  loginSubmitEpic,
  logoutEpic,
  getCsrfTokenEpic,
);

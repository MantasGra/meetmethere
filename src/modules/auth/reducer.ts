import { createReducer } from '@reduxjs/toolkit';

import type { ParticipationStatus } from '../invitations/reducer';

import {
  authAuthorizeUserRequest,
  authChangeSubmitErrorRequest,
  authDialogTypeChangeRequest,
  authLoginDialogVisibleChangeRequest,
  authOpenLoginProposal,
  authSwitchToLoginProposal,
  authSwitchToRegisterProposal,
  authLogoutRequest,
  authSetAuthLoading,
  authAuthorizeUserProposal,
  authSetCsrfTokenRequest,
  authChangePasswordDialogVisibleChangeRequest,
  authChangePasswordChangeErrors,
  authResetPasswordErrorsChange,
} from './actions';

export interface IAccount {
  id: number;
  name: string;
  lastName: string;
  email: string;
  color: string;
}

export type IUser = IAccount;

export interface IParticipant extends IUser {
  userParticipationStatus: ParticipationStatus;
}

export interface IFormError {
  overall?: string;
  email?: string;
  password?: string;
}

export interface IChangePasswordError {
  oldPassword?: string;
}

export interface IResetPasswordError {
  overall?: string;
}

export enum AuthDialogType {
  Login = 'login',
  Register = 'register',
  ResetPassword = 'resetPassword',
}

export interface AuthState {
  account?: IAccount;
  authLoading: boolean;
  csrfToken?: string;
  formErrors: IFormError;
  changePasswordErrors: IChangePasswordError;
  resetPasswordErrors: IResetPasswordError;
  isAuthDialogOpen: boolean;
  authDialogType: AuthDialogType;
  isChangePasswordDialogOpen: boolean;
}

const initialState: AuthState = {
  formErrors: {},
  changePasswordErrors: {},
  resetPasswordErrors: {},
  authLoading: false,
  isAuthDialogOpen: false,
  authDialogType: AuthDialogType.Login,
  isChangePasswordDialogOpen: false,
};

const authReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(authAuthorizeUserProposal, (state) => {
      state.authLoading = true;
    })
    .addCase(authSetAuthLoading, (state, action) => {
      state.authLoading = action.payload;
    })
    .addCase(authLoginDialogVisibleChangeRequest, (state, action) => {
      if (action.payload) {
        state.authDialogType = AuthDialogType.Login;
      }
      state.isAuthDialogOpen = action.payload;
    })
    .addCase(authDialogTypeChangeRequest, (state, action) => {
      state.authDialogType = action.payload;
      state.formErrors = {};
    })
    .addCase(authAuthorizeUserRequest, (state, action) => {
      state.account = action.payload;
      state.authLoading = false;
    })
    .addCase(authOpenLoginProposal, (state) => {
      state.formErrors = {};
    })
    .addCase(authSwitchToLoginProposal, (state) => {
      state.formErrors = {};
    })
    .addCase(authSwitchToRegisterProposal, (state) => {
      state.formErrors = {};
    })
    .addCase(authChangeSubmitErrorRequest, (state, action) => {
      state.formErrors = action.payload;
    })
    .addCase(authLogoutRequest, (state) => {
      delete state.account;
    })
    .addCase(authSetCsrfTokenRequest, (state, action) => {
      state.csrfToken = action.payload;
    })
    .addCase(authChangePasswordDialogVisibleChangeRequest, (state, action) => {
      if (!action.payload) {
        state.changePasswordErrors = {};
      }
      state.isChangePasswordDialogOpen = action.payload;
    })
    .addCase(authChangePasswordChangeErrors, (state, action) => {
      state.changePasswordErrors = action.payload;
    })
    .addCase(authResetPasswordErrorsChange, (state, action) => {
      state.resetPasswordErrors = action.payload;
    }),
);

export default authReducer;

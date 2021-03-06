import { createReducer } from '@reduxjs/toolkit';
import type { ParticipationStatus } from '../invitations/reducer';
import {
  authAuthorizeUserRequest,
  authChangeSubmitErrorRequest,
  authIsDialogRegisterChangeRequest,
  authLoginDialogVisibleChangeRequest,
  authOpenLoginProposal,
  authSwitchToLoginProposal,
  authSwitchToRegisterProposal,
  authLogoutRequest,
  authSetAuthLoading,
  authAuthorizeUserProposal,
} from './actions';

export interface IAccount {
  id: number;
  name: string;
  lastName: string;
  email: string;
  createDate: Date;
  color: string;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  lastName: string;
  color: string;
}

export interface IUserInvitation extends IUser {
  userParticipationStatus: ParticipationStatus;
}

export interface IFormError {
  overall?: string;
  email?: string;
  password?: string;
}

interface AuthState {
  account?: IAccount;
  authLoading: boolean;
  formErrors: IFormError;
  isAuthDialogOpen: boolean;
  isDialogRegister: boolean;
}

const initialState: AuthState = {
  formErrors: {},
  authLoading: false,
  isAuthDialogOpen: false,
  isDialogRegister: false,
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
        state.isDialogRegister = false;
      }
      state.isAuthDialogOpen = action.payload;
    })
    .addCase(authIsDialogRegisterChangeRequest, (state, action) => {
      state.isDialogRegister = action.payload;
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
    }),
);

export default authReducer;

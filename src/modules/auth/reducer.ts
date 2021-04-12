import { createReducer } from '@reduxjs/toolkit';
import {
  authAuthorizeUserRequest,
  authChangeSubmitErrorRequest,
  authIsDialogRegisterChangeRequest,
  authLoginDialogVisibleChangeRequest,
  authOpenLoginProposal,
  authSwitchToLoginProposal,
  authSwitchToRegisterProposal,
  authLogoutRequest,
} from './actions';

export interface IAccount {
  email: string;
  createDate: Date;
}

export interface IFormError {
  overall?: string;
  email?: string;
  password?: string;
}

interface AuthState {
  account?: IAccount;
  formErrors: IFormError;
  isAuthDialogOpen: boolean;
  isDialogRegister: boolean;
}

const initialState: AuthState = {
  formErrors: {},
  isAuthDialogOpen: false,
  isDialogRegister: false,
};

const authReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(authLoginDialogVisibleChangeRequest, (state, action) => {
      if (action.payload) {
        state.isDialogRegister = false;
      }
      state.isAuthDialogOpen = action.payload;
    })
    .addCase(authIsDialogRegisterChangeRequest, (state, action) => {
      state.isDialogRegister = action.payload;
    })
    .addCase(authAuthorizeUserRequest, (state, action) => {
      state.account = action.payload;
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

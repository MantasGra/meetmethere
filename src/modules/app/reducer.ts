import { combineReducers, createReducer, Selector } from '@reduxjs/toolkit';
import { responsiveStateReducer } from 'redux-responsive';

import { appInitSuccess, openMobileMenu } from './actions';
import authReducer from '../auth/reducer';
import snackbarsReducer from '../snackbars/reducer';
import meetingsReducer from '../meetings/reducer';

interface ApplicationState {
  initialized: boolean;
  isMobileMenuOpen: boolean;
}

const initialState: ApplicationState = {
  initialized: false,
  isMobileMenuOpen: false,
};

const appReducer = createReducer(initialState, (buildier) =>
  buildier
    .addCase(appInitSuccess, (state) => {
      state.initialized = true;
    })
    .addCase(openMobileMenu, (state, action) => {
      state.isMobileMenuOpen = action.payload;
    }),
);

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  browser: responsiveStateReducer,
  snackbars: snackbarsReducer,
  meetings: meetingsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppSelector<R> = Selector<RootState, R>;
export default rootReducer;

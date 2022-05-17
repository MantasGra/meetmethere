import { combineReducers, createReducer, Selector } from '@reduxjs/toolkit';
import { responsiveStateReducer } from 'redux-responsive';

import activitiesReducer from '../activitites/reducer';
import announcementsReducer from '../announcements/reducer';
import authReducer from '../auth/reducer';
import expensesReducer from '../expenses/reducer';
import formSubmitBlockerReducer from '../formSubmitBlocker/reducer';
import invitationsReducer from '../invitations/reducer';
import meetingsReducer from '../meetings/reducer';
import snackbarsReducer from '../snackbars/reducer';

import { appInitSuccess, openMobileMenu, toggleMobileMenu } from './actions';

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
    })
    .addCase(toggleMobileMenu, (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    }),
);

const rootReducer = combineReducers({
  announcements: announcementsReducer,
  expenses: expensesReducer,
  app: appReducer,
  auth: authReducer,
  browser: responsiveStateReducer,
  snackbars: snackbarsReducer,
  meetings: meetingsReducer,
  activities: activitiesReducer,
  invitations: invitationsReducer,
  formSubmitBlocker: formSubmitBlockerReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppSelector<R> = Selector<RootState, R>;
export default rootReducer;

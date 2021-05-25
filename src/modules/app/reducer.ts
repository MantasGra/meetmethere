import { combineReducers, createReducer, Selector } from '@reduxjs/toolkit';
import { responsiveStateReducer } from 'redux-responsive';

import { appInitSuccess, openMobileMenu } from './actions';
import authReducer from '../auth/reducer';
import snackbarsReducer from '../snackbars/reducer';
import meetingsReducer from '../meetings/reducer';
import announcementsReducer from '../announcements/reducer';
import activitiesReducer from '../activitites/reducer';
import expensesReducer from '../expenses/reducer';

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
  announcements: announcementsReducer,
  expenses: expensesReducer,
  app: appReducer,
  auth: authReducer,
  browser: responsiveStateReducer,
  snackbars: snackbarsReducer,
  meetings: meetingsReducer,
  activities: activitiesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppSelector<R> = Selector<RootState, R>;
export default rootReducer;

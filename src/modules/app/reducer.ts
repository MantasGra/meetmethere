import { combineReducers } from '@reduxjs/toolkit';
import { responsiveStateReducer } from 'redux-responsive';
import authReducer from '../auth/reducer';
import snackbarsReducer from '../snackbars/reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  browser: responsiveStateReducer,
  snackbars: snackbarsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;

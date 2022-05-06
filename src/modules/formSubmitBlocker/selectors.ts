import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../app/reducer';

import { FormSubmitBlockerState } from './reducer';

export const formSubmitBlockerStateSelector = (
  state: RootState,
): FormSubmitBlockerState => state.formSubmitBlocker;

export const formSubmitBlockerIsSubmittingSelector = createSelector(
  formSubmitBlockerStateSelector,
  (formSubmitBlockerState) => formSubmitBlockerState.isSubmitting,
);

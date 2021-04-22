import type { RootState } from './reducer';

export const isMobileSelector = (state: RootState): boolean =>
  state.browser.lessThan.medium;

export const isAppInitializedSelector = (state: RootState): boolean =>
  state.app.initialized;

export const isMobileMenuOpenSelector = (state: RootState): boolean =>
  state.app.isMobileMenuOpen;

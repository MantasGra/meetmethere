import type { RootState } from './reducer';

export const isMobileSelector = (state: RootState): boolean =>
  state.browser.lessThan.medium;

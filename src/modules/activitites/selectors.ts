import { createSelector } from '@reduxjs/toolkit';
import { toOrderedList } from 'src/utils/transformators';

import type { RootState } from '../app/reducer';

import type { ActivityState } from './reducer';

export const activitiesStateSelector = (state: RootState): ActivityState =>
  state.activities;

export const activitiesFormDialogMeetingIdSelector = createSelector(
  activitiesStateSelector,
  (activitiesState) => activitiesState.formDialogMeetingId,
);

export const activitiesIsFormDialogOpenSelector = createSelector(
  activitiesFormDialogMeetingIdSelector,
  (meetingId) => !!meetingId,
);

export const activitiesIdsSelector = createSelector(
  activitiesStateSelector,
  (activitiesState) => activitiesState.activityIds,
);

export const activitiesMapSelector = createSelector(
  activitiesStateSelector,
  (activitiesState) => activitiesState.activities,
);

export const activitiesListSelector = createSelector(
  activitiesIdsSelector,
  activitiesMapSelector,
  // need the following callback for ts to infer types correctly :/
  // it is an issue as of @reduxjs/toolkit v1.8.1 and typescript v4.6.3
  // I would expect to just be able to write `toOrderedList` in the future here.
  (ids, activities) => toOrderedList(ids, activities),
);

export const activitiesLoadingSelector = createSelector(
  activitiesStateSelector,
  (activitiesState) => activitiesState.activitesLoading,
);

export const activitiesFormDialogActivityIdSelector = createSelector(
  activitiesStateSelector,
  (activitiesState) => activitiesState.formDialogActivityId,
);

export const activitiesIsFormEditSelector = createSelector(
  activitiesFormDialogActivityIdSelector,
  (activityId) => !!activityId,
);

export const activitiesEditedActivitySelector = createSelector(
  activitiesFormDialogActivityIdSelector,
  activitiesMapSelector,
  (activityId, activities) => (activityId ? activities[activityId] : null),
);

import type { RootState } from '../app/reducer';
import type { IActivity } from './reducer';

export const activitiesIsFormDialogOpenSelector = (state: RootState): boolean =>
  !!state.activities.formDialogMeetingId;

export const activitiesFormDialogMeetingIdSelector = (
  state: RootState,
): number | null => state.activities.formDialogMeetingId;

export const activitiesListSelector = (state: RootState): IActivity[] =>
  state.activities.activityIds.map(
    (activityId) => state.activities.activities[activityId],
  );

export const activitiesLoadingSelector = (state: RootState): boolean =>
  state.activities.activitesLoading;

export const activitiesIsFormEditSelector = (state: RootState): boolean =>
  !!state.activities.formDialogActivityId;

export const activitiesEditedActivitySelector = (
  state: RootState,
): IActivity | null =>
  state.activities.formDialogActivityId
    ? state.activities.activities[state.activities.formDialogActivityId]
    : null;

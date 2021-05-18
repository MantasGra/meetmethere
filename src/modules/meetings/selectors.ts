import type { RootState } from '../app/reducer';
import type { IMeeting } from './reducer';

export const meetingsPlannedSelector = (state: RootState): IMeeting[] =>
  state.meetings.plannedMeetingIds.map(
    (value) => state.meetings.plannedMeetings[value],
  );

export const meetingsPlannedMeetingsLoadingSelector = (
  state: RootState,
): boolean => state.meetings.plannedMeetingsLoading;

export const meetingsPlannedMeetingsHasMoreSelector = (
  state: RootState,
): boolean =>
  state.meetings.plannedMeetingIds.length < state.meetings.plannedMeetingCount;

export const meetingsPlannedMeetingLoadFailedSelector = (
  state: RootState,
): boolean => state.meetings.plannedMeetingLoadFailed;

export const meetingsIsCreateDialogOpenSelector = (state: RootState): boolean =>
  state.meetings.isCreateDialogOpen;

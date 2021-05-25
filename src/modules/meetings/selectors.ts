import type { RootState } from '../app/reducer';
import type { IMeeting, MeetingTabs, IMeetingDatesPollEntry } from './reducer';

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

export const meetingsMeetingByIdSelector = (
  state: RootState,
  id: number,
): IMeeting => state.meetings.plannedMeetings[id];

export const meetingsActiveMeetingTabSelector = (
  state: RootState,
): MeetingTabs => state.meetings.activeMeetingTab;

export const meetingsMeetingLoadedSelector = (
  state: RootState,
  id: number,
): boolean => !!state.meetings.plannedMeetings[id];

export const meetingsMeetingLoadFailedSelector = (state: RootState): boolean =>
  state.meetings.meetingLoadFailed;

export const meetingsIsMeetingPollDialogOpenSelector = (
  state: RootState,
): boolean => !!state.meetings.meetingPollFormId;

export const meetingsMeetingDatesPollFormIdSelector = (
  state: RootState,
): number | null => state.meetings.meetingPollFormId;

export const meetingsDatesPollEntriesSelector = (
  state: RootState,
  id: number,
): IMeetingDatesPollEntry[] =>
  state.meetings.plannedMeetings[id].meetingDatesPollEntries;

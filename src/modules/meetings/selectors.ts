import type { RootState } from '../app/reducer';
import type { IUserInvitation } from '../auth/reducer';
import type { IInvitation } from '../invitations/reducer';
import type { IMeeting, MeetingTabs } from './reducer';

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

export const invitationMeetingByIdSelector = (
  state: RootState,
  id: number,
): IUserInvitation => state.meetings.plannedMeetings[id].participants
.filter((participant: IUserInvitation) => participant.email === state.auth.account?.email)[0]

export const meetingsActiveMeetingTabSelector = (
  state: RootState,
): MeetingTabs => state.meetings.activeMeetingTab;

export const meetingsMeetingLoadedSelector = (
  state: RootState,
  id: number,
): boolean => !!state.meetings.plannedMeetings[id];

export const meetingsMeetingLoadFailedSelector = (state: RootState): boolean =>
  state.meetings.meetingLoadFailed;

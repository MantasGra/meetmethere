import type { RootState } from '../app/reducer';
import type { IUserInvitation } from '../auth/reducer';
import {
  IMeeting,
  MeetingTabs,
  IMeetingDatesPollEntry,
  MeetingStatus,
  updateRequest,
} from './reducer';

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

export const meetingsHistoricSelector = (state: RootState): IMeeting[] =>
  state.meetings.historicMeetingIds.map(
    (value) => state.meetings.historicMeetings[value],
  );

export const meetingsHistoricMeetingsLoadingSelector = (
  state: RootState,
): boolean => state.meetings.historicMeetingsLoading;

export const meetingsHistoricMeetingsHasMoreSelector = (
  state: RootState,
): boolean =>
  state.meetings.historicMeetingIds.length <
  state.meetings.historicMeetingCount;

export const meetingsHistoricMeetingLoadFailedSelector = (
  state: RootState,
): boolean => state.meetings.historicMeetingLoadFailed;

export const meetingsIsCreateDialogOpenSelector = (state: RootState): boolean =>
  state.meetings.isCreateDialogOpen;

export const meetingsMeetingByIdSelector = (
  state: RootState,
  id: number,
): IMeeting =>
  state.meetings.plannedMeetings[id] || state.meetings.historicMeetings[id];

export const invitationMeetingByIdSelector = (
  state: RootState,
  id: number,
): IUserInvitation =>
  (
    state.meetings.plannedMeetings[id] || state.meetings.historicMeetings[id]
  ).participants.filter(
    (participant: IUserInvitation) =>
      participant.email === state.auth.account?.email,
  )[0];

export const meetingsActiveMeetingTabSelector = (
  state: RootState,
): MeetingTabs => state.meetings.activeMeetingTab;

export const meetingsMeetingLoadedSelector = (
  state: RootState,
  id: number,
): boolean =>
  !!state.meetings.plannedMeetings[id] || !!state.meetings.historicMeetings[id];

export const meetingsMeetingLoadFailedSelector = (state: RootState): boolean =>
  state.meetings.meetingLoadFailed;

export const meetingsIsMeetingPollDialogOpenSelector = (
  state: RootState,
): boolean => !!state.meetings.meetingPollFormId;

export const meetingsMeetingDatesPollFormIdSelector = (
  state: RootState,
): number | null => state.meetings.meetingPollFormId;

export const meetingsMeetingHasUserPollEntryAdditionsEnabled = (
  state: RootState, meetingId: number
): boolean => state.meetings.plannedMeetings[meetingId]?.canUsersAddPollEntries;

export const meetingsDatesPollEntriesSelector = (
  state: RootState,
  id: number,
): IMeetingDatesPollEntry[] =>
  (state.meetings.plannedMeetings[id] || state.meetings.historicMeetings[id])
    .meetingDatesPollEntries;

export const meetingsMeetingParticipantsSelector = (
  state: RootState,
  id: number,
): IUserInvitation[] =>
  (state.meetings.plannedMeetings[id] || state.meetings.historicMeetings[id])
    ?.participants || [];

export const meetingsIsUserCreator = (
  state: RootState,
  meetingId: number,
): boolean =>
  !!state.auth.account &&
  (state.meetings.plannedMeetings[meetingId] ||
    state.meetings.historicMeetings[meetingId]) &&
  state.auth.account.id ===
    (
      state.meetings.plannedMeetings[meetingId] ||
      state.meetings.historicMeetings[meetingId]
    )?.creator?.id;

export const meetingsIsEditMode = (
  state: RootState,
  meetingId: number,
): boolean => state.meetings.editMode === meetingId;

export const meetingsIsMeetingHistorical = (
  state: RootState,
  meetingId: number,
): boolean =>
  [MeetingStatus.Canceled, MeetingStatus.Ended].includes(
    (
      state.meetings.plannedMeetings[meetingId] ||
      state.meetings.historicMeetings[meetingId]
    )?.status,
  );

export const meetingsCancelingMeetingSelector = (
  state: RootState,
): typeof updateRequest.payload | null => state.meetings.cancelingMeeting;

export const meetingsCancelMeetingDialogIsOpen = (state: RootState): boolean =>
  !!state.meetings.cancelingMeeting;

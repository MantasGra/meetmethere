import { createSelector } from '@reduxjs/toolkit';
import { toOrderedList } from 'src/utils/transformators';

import type { RootState } from '../app/reducer';
import { authCurrentUserIdSelector } from '../auth/selectors';

import { MeetingStatus, MeetingState, MeetingTypes } from './reducer';

export const meetingsStateSelector = (state: RootState): MeetingState =>
  state.meetings;

const idGetter = (_state: RootState, id: number) => id;

const typeOfMeetingGetter = (_state: RootState, typeOfMeeting: MeetingTypes) =>
  typeOfMeeting;

export const meetingsMapSelector = createSelector(
  meetingsStateSelector,
  (meetingsState) => meetingsState.meetings,
);

export const meetingsListDataSelector = createSelector(
  meetingsStateSelector,
  (meetingsState) => meetingsState.meetingListData,
);

export const meetingsListDataByTypeSelector = createSelector(
  meetingsListDataSelector,
  typeOfMeetingGetter,
  (meetingsListData, typeOfMeeting) => meetingsListData[typeOfMeeting],
);

export const meetingsListIdsSelector = createSelector(
  meetingsListDataByTypeSelector,
  (meetingListData) => meetingListData.ids,
);

export const meetingsListSelector = createSelector(
  meetingsListIdsSelector,
  meetingsMapSelector,
  (ids, meetings) => toOrderedList(ids, meetings),
);

export const meetingsListLoadingSelector = createSelector(
  meetingsListDataByTypeSelector,
  (meetingsListData) => meetingsListData.loading,
);

export const meetingsListCountSelector = createSelector(
  meetingsListDataByTypeSelector,
  (meetingsListData) => meetingsListData.count,
);

export const meetingsListHasMoreSelector = createSelector(
  meetingsListCountSelector,
  meetingsListIdsSelector,
  (count, ids) => !count || count > ids.length,
);

export const meetingsListLoadFailedSelector = createSelector(
  meetingsListDataByTypeSelector,
  (meetingsListData) => meetingsListData.loadFailed,
);

export const meetingsIsCreateDialogOpenSelector = createSelector(
  meetingsStateSelector,
  (meetingsState) => meetingsState.isCreateDialogOpen,
);

export const meetingsMeetingByIdSelector = createSelector(
  meetingsMapSelector,
  idGetter,
  (meetingsMap, id) => meetingsMap[id],
);

export const meetingsMeetingParticipantsSelector = createSelector(
  meetingsMeetingByIdSelector,
  (meeting) => meeting?.participants || [],
);

export const meetingsCurrentUserAsMeetingParticipantSelector = createSelector(
  meetingsMeetingParticipantsSelector,
  authCurrentUserIdSelector,
  (meetingParticipants, currentUserId) =>
    meetingParticipants.find((participant) => participant.id === currentUserId),
);

export const meetingsActiveMeetingTabSelector = createSelector(
  meetingsStateSelector,
  (meetingsState) => meetingsState.activeMeetingTab,
);

export const meetingsMeetingLoadedSelector = createSelector(
  meetingsMeetingByIdSelector,
  (meeting) => !!meeting,
);

export const meetingsMeetingLoadFailedSelector = createSelector(
  meetingsStateSelector,
  (meetingsState) => meetingsState.meetingLoadFailed,
);

export const meetingsMeetingDatesPollFormIdSelector = createSelector(
  meetingsStateSelector,
  (meetingsState) => meetingsState.meetingPollFormId,
);

export const meetingsIsMeetingPollDialogOpenSelector = createSelector(
  meetingsMeetingDatesPollFormIdSelector,
  (meetingPollFormId) => !!meetingPollFormId,
);

export const meetingsMeetingHasUserPollEntryAdditionsEnabledSelector =
  createSelector(
    meetingsMeetingByIdSelector,
    (meeting) => meeting?.canUsersAddPollEntries,
  );

export const meetingsDatesPollEntriesSelector = createSelector(
  meetingsMeetingByIdSelector,
  (meeting) => meeting?.meetingDatesPollEntries || [],
);

export const meetingsIsUserCreator = createSelector(
  meetingsMeetingByIdSelector,
  authCurrentUserIdSelector,
  (meeting, currentUserId) =>
    !!meeting && !!currentUserId && meeting.creator.id === currentUserId,
);

export const meetingsIsEditMode = createSelector(
  meetingsStateSelector,
  idGetter,
  (meetingsState, id) => meetingsState.editMode === id,
);

export const meetingsStatusByIdSelector = createSelector(
  meetingsMeetingByIdSelector,
  (meeting) => meeting?.status,
);

export const meetingsIsMeetingArchived = createSelector(
  meetingsStatusByIdSelector,
  (status) => [MeetingStatus.Canceled, MeetingStatus.Ended].includes(status),
);

export const meetingsCancelingMeetingSelector = createSelector(
  meetingsStateSelector,
  (meetingsState) => meetingsState.cancelingMeeting,
);

export const meetingsCancelMeetingDialogIsOpen = createSelector(
  meetingsCancelingMeetingSelector,
  (cancelingMeeting) => !!cancelingMeeting,
);

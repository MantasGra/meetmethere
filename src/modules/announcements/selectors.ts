import { createSelector } from '@reduxjs/toolkit';
import { toOrderedList } from 'src/utils/transformators';

import type { RootState } from '../app/reducer';

import type { AnnouncementState } from './reducer';

export const announcementsStateSelector = (
  state: RootState,
): AnnouncementState => state.announcements;

export const announcementsLoadingSelector = createSelector(
  announcementsStateSelector,
  (announcementsState) => announcementsState.announcementsLoading,
);

export const announcementsIdsSelector = createSelector(
  announcementsStateSelector,
  (announcementsState) => announcementsState.announcementIds,
);

export const announcementsCountSelector = createSelector(
  announcementsStateSelector,
  (announcementsState) => announcementsState.announcementsCount,
);

export const announcementsHasMoreSelector = createSelector(
  announcementsIdsSelector,
  announcementsCountSelector,
  (ids, count) => ids.length < count,
);

export const announcementsMapSelector = createSelector(
  announcementsStateSelector,
  (announcementsState) => announcementsState.announcements,
);

export const announcementsListSelector = createSelector(
  announcementsIdsSelector,
  announcementsMapSelector,
  (ids, announcements) => toOrderedList(ids, announcements),
);

export const announcementsLoadFailedSelector = createSelector(
  announcementsStateSelector,
  (announcementsState) => announcementsState.announcementsLoadFailed,
);

export const announcementsFormDialogMeetingIdSelector = createSelector(
  announcementsStateSelector,
  (announcementsState) => announcementsState.formDialogMeetingId,
);

export const announcementsIsFormDialogOpenSelector = createSelector(
  announcementsFormDialogMeetingIdSelector,
  (meetingId) => !!meetingId,
);

export const announcementsFormDialogAnnouncementIdSelector = createSelector(
  announcementsStateSelector,
  (announcementsState) => announcementsState.formDialogAnnouncementId,
);

export const announcementsIsFormEditSelector = createSelector(
  announcementsFormDialogAnnouncementIdSelector,
  (announcementId) => !!announcementId,
);

export const announcementsEditedAnnouncementSelector = createSelector(
  announcementsFormDialogAnnouncementIdSelector,
  announcementsMapSelector,
  (announcementId, announcements) =>
    announcementId ? announcements[announcementId] : null,
);

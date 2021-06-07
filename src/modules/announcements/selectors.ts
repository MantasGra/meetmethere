import type { RootState } from '../app/reducer';
import type { IAnnouncement } from './reducer';

export const announcementsLoadingSelector = (state: RootState): boolean =>
  state.announcements.announcementsLoading;

export const announcementsHasMoreSelector = (state: RootState): boolean =>
  state.announcements.announcementIds.length <
  state.announcements.announcementsCount;

export const announcementsListSelector = (state: RootState): IAnnouncement[] =>
  state.announcements.announcementIds.map(
    (value) => state.announcements.announcements[value],
  );

export const announcementsLoadFailedSelector = (state: RootState): boolean =>
  state.announcements.announcementsLoadFailed;

export const announcementsFormDialogMeetingIdSelector = (
  state: RootState,
): null | number => state.announcements.formDialogMeetingId;

export const announcementsIsFormDialogOpenSelector = (
  state: RootState,
): boolean => !!state.announcements.formDialogMeetingId;

export const announcementsIsFormEditSelector = (state: RootState): boolean =>
  !!state.announcements.formDialogAnnouncementId;

export const announcementsEditedAnnouncementSelector = (
  state: RootState,
): IAnnouncement | null =>
  state.announcements.formDialogAnnouncementId
    ? state.announcements.announcements[
        state.announcements.formDialogAnnouncementId
      ]
    : null;

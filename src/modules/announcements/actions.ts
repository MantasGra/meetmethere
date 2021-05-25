import { createAction } from '@reduxjs/toolkit';
import { withPayloadType } from '../app/actions';
import type { IAnnouncement } from './reducer';

export const announcementsLoadAnnouncementsProposal = createAction(
  'announcements/loadAnnouncementsProposal',
  (meetingId: number, page: number) => ({ payload: { page, meetingId } }),
);

export const announcementsLoadAnnouncementsSuccess = createAction(
  'announcements/loadAnnouncementsSuccess',
  (announcements: IAnnouncement[], announcementCount: number) => ({
    payload: { announcements, announcementCount },
  }),
);

export const announcementsLoadAnnouncementsFail = createAction(
  'announcements/loadAnnouncementsFail',
);

export const announcementsFormDialogMeetingIdChangeRequest = createAction(
  'announcements/formDialogMeetingIdChangeRequest',
  withPayloadType<number | null>(),
);

export interface ICreateAnnouncementRequest {
  title: string;
  description: string;
}

export const announcementsCreateAnnouncementProposal = createAction(
  'announcements/createAnnouncementProposal',
  (announcement: ICreateAnnouncementRequest, meetingId: number) => ({
    payload: {
      announcement,
      meetingId,
    },
  }),
);

export const announcementsAddAnnouncement = createAction(
  'announcements/addAnnouncement',
  withPayloadType<IAnnouncement>(),
);

export type AnnouncementsActions =
  | ReturnType<typeof announcementsLoadAnnouncementsProposal>
  | ReturnType<typeof announcementsLoadAnnouncementsSuccess>
  | ReturnType<typeof announcementsLoadAnnouncementsFail>
  | ReturnType<typeof announcementsFormDialogMeetingIdChangeRequest>
  | ReturnType<typeof announcementsCreateAnnouncementProposal>
  | ReturnType<typeof announcementsAddAnnouncement>;

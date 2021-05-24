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

export const announcementsEditAnnouncementIdChange = createAction(
  'announcements/editAnnouncementIdChange',
  (meetingId: number | null, announcementId: number | null) => ({
    payload: { meetingId, announcementId },
  }),
);

export const announcementsEditAnnouncementProposal = createAction(
  'announcements/editAnnouncementProposal',
  (
    announcement: ICreateAnnouncementRequest,
    meetingId: number,
    announcementId: number,
  ) => ({ payload: { announcement, meetingId, announcementId } }),
);

export const announcementsEditAnnouncementRequest = createAction(
  'announcements/editAnnouncementRequest',
  withPayloadType<IAnnouncement>(),
);

export const announcementsDeleteAnnouncementProposal = createAction(
  'announcements/deleteAnnouncementProposal',
  (meetingId: number, announcementId: number) => ({
    payload: { meetingId, announcementId },
  }),
);

export const announcementsDeleteAnnouncementRequest = createAction(
  'announcements/deleteAnnouncementRequest',
  withPayloadType<number>(),
);

export type AnnouncementsActions =
  | ReturnType<typeof announcementsLoadAnnouncementsProposal>
  | ReturnType<typeof announcementsLoadAnnouncementsSuccess>
  | ReturnType<typeof announcementsLoadAnnouncementsFail>
  | ReturnType<typeof announcementsFormDialogMeetingIdChangeRequest>
  | ReturnType<typeof announcementsCreateAnnouncementProposal>
  | ReturnType<typeof announcementsAddAnnouncement>
  | ReturnType<typeof announcementsEditAnnouncementIdChange>
  | ReturnType<typeof announcementsEditAnnouncementProposal>
  | ReturnType<typeof announcementsEditAnnouncementRequest>
  | ReturnType<typeof announcementsDeleteAnnouncementProposal>
  | ReturnType<typeof announcementsDeleteAnnouncementRequest>;

import { createReducer } from '@reduxjs/toolkit';
import compareDesc from 'date-fns/compareDesc';
import type { IUser } from '../auth/reducer';
import {
  announcementsAddAnnouncement,
  announcementsDeleteAnnouncementRequest,
  announcementsEditAnnouncementIdChange,
  announcementsEditAnnouncementRequest,
  announcementsFormDialogMeetingIdChangeRequest,
  announcementsLoadAnnouncementsFail,
  announcementsLoadAnnouncementsProposal,
  announcementsLoadAnnouncementsSuccess,
} from './actions';

export interface IAnnouncement {
  id: number;
  title: string;
  description: string;
  user: IUser;
  createDate: Date;
}

interface AnnouncementState {
  announcementsLoading: boolean;
  announcementIds: number[];
  announcements: Record<number, IAnnouncement>;
  announcementsCount: number;
  announcementsLoadFailed: boolean;
  formDialogMeetingId: number | null;
  formDialogAnnouncementId: number | null;
}

const initialState: AnnouncementState = {
  announcementsLoading: false,
  announcementIds: [],
  announcements: {},
  announcementsCount: 0,
  announcementsLoadFailed: false,
  formDialogMeetingId: null,
  formDialogAnnouncementId: null,
};

const announcementsReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(announcementsLoadAnnouncementsProposal, (state, action) => {
      state.announcementsLoading = true;
      if (action.payload.page === 1) {
        state.announcements = {};
        state.announcementIds = [];
        state.announcementsCount = 0;
      }
    })
    .addCase(announcementsLoadAnnouncementsSuccess, (state, action) => {
      action.payload.announcements.forEach((announcement) => {
        state.announcements[announcement.id] = announcement;
        if (!state.announcementIds.includes(announcement.id)) {
          state.announcementIds.push(announcement.id);
        }
      });
      state.announcementIds = state.announcementIds.sort(compareDesc);
      state.announcementsCount = action.payload.announcementCount;
      state.announcementsLoading = false;
      state.announcementsLoadFailed = false;
    })
    .addCase(announcementsLoadAnnouncementsFail, (state) => {
      state.announcementsLoadFailed = true;
      state.announcementsLoading = false;
    })
    .addCase(announcementsFormDialogMeetingIdChangeRequest, (state, action) => {
      state.formDialogMeetingId = action.payload;
    })
    .addCase(announcementsAddAnnouncement, (state, action) => {
      state.announcements[action.payload.id] = action.payload;
      state.announcementIds.unshift(action.payload.id);
    })
    .addCase(announcementsEditAnnouncementIdChange, (state, action) => {
      state.formDialogMeetingId = action.payload.meetingId;
      state.formDialogAnnouncementId = action.payload.announcementId;
    })
    .addCase(announcementsEditAnnouncementRequest, (state, action) => {
      state.announcements[action.payload.id] = action.payload;
    })
    .addCase(announcementsDeleteAnnouncementRequest, (state, action) => {
      delete state.announcements[action.payload];
      state.announcementIds = state.announcementIds.filter(
        (id) => id !== action.payload,
      );
    }),
);

export default announcementsReducer;

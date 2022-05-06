import { combineEpics } from 'redux-observable';
import { of } from 'rxjs';
import { mergeMap, map, pluck, catchError } from 'rxjs/operators';
import { fromAxios, ofActionType } from 'src/utils/operators';

import type { AppEpic } from '../app/epics';
import { snackbarsEnqueue } from '../snackbars/actions';

import {
  announcementsAddAnnouncement,
  announcementsCreateAnnouncementProposal,
  announcementsDeleteAnnouncementProposal,
  announcementsDeleteAnnouncementRequest,
  announcementsEditAnnouncementIdChange,
  announcementsEditAnnouncementProposal,
  announcementsEditAnnouncementRequest,
  announcementsFormDialogMeetingIdChangeRequest,
  announcementsLoadAnnouncementsFail,
  announcementsLoadAnnouncementsProposal,
  announcementsLoadAnnouncementsSuccess,
} from './actions';
import type { IAnnouncement } from './reducer';

interface ILoadAnnouncementsResponse {
  announcements: IAnnouncement[];
  count: number;
}

const loadAnnouncementsEpic: AppEpic = (action$, _, { axios }) =>
  action$.pipe(
    ofActionType(announcementsLoadAnnouncementsProposal),
    pluck('payload'),
    mergeMap(({ page, meetingId }) =>
      fromAxios<ILoadAnnouncementsResponse>(axios, {
        url: `/meeting/${meetingId}/announcements`,
        method: 'GET',
        params: { page },
        withCredentials: true,
      }).pipe(
        map((response) =>
          announcementsLoadAnnouncementsSuccess(
            response.data.announcements,
            response.data.count,
          ),
        ),
        catchError(() => of(announcementsLoadAnnouncementsFail())),
      ),
    ),
  );

interface ICreateAnnouncementResponse {
  createdAnnouncement: IAnnouncement;
}

const createAnnouncementEpic: AppEpic = (action$, _, { axios }) =>
  action$.pipe(
    ofActionType(announcementsCreateAnnouncementProposal),
    pluck('payload'),
    mergeMap(({ announcement, meetingId }) =>
      fromAxios<ICreateAnnouncementResponse>(axios, {
        url: `/meeting/${meetingId}/announcements`,
        method: 'POST',
        data: announcement,
        withCredentials: true,
      }).pipe(
        mergeMap((response) =>
          of(
            announcementsAddAnnouncement(response.data.createdAnnouncement),
            announcementsFormDialogMeetingIdChangeRequest(null),
            snackbarsEnqueue({
              message: 'Announcement posted!',
              options: {
                variant: 'success',
              },
            }),
          ),
        ),
        catchError(() =>
          of(
            snackbarsEnqueue({
              message: 'Announcement creation failed!',
              options: {
                variant: 'error',
              },
            }),
          ),
        ),
      ),
    ),
  );

const editAnnouncementEpic: AppEpic = (action$, _, { axios }) =>
  action$.pipe(
    ofActionType(announcementsEditAnnouncementProposal),
    pluck('payload'),
    mergeMap(({ meetingId, announcementId, announcement }) =>
      fromAxios<IAnnouncement>(axios, {
        url: `/meeting/${meetingId}/announcements/${announcementId}`,
        method: 'PATCH',
        data: announcement,
        withCredentials: true,
      }).pipe(
        mergeMap((response) =>
          of(
            announcementsEditAnnouncementRequest(response.data),
            announcementsEditAnnouncementIdChange(null, null),
            snackbarsEnqueue({
              message: 'Announcement updated!',
              options: {
                variant: 'success',
              },
            }),
          ),
        ),
        catchError(() =>
          of(
            snackbarsEnqueue({
              message: 'Failed to update announcement!',
              options: {
                variant: 'error',
              },
            }),
          ),
        ),
      ),
    ),
  );

const deleteAnnouncementEpic: AppEpic = (action$, _, { axios }) =>
  action$.pipe(
    ofActionType(announcementsDeleteAnnouncementProposal),
    pluck('payload'),
    mergeMap(({ meetingId, announcementId }) =>
      fromAxios<never>(axios, {
        url: `/meeting/${meetingId}/announcements/${announcementId}`,
        method: 'DELETE',
        withCredentials: true,
      }).pipe(
        mergeMap(() =>
          of(
            announcementsDeleteAnnouncementRequest(announcementId),
            snackbarsEnqueue({
              message: 'Announcement deleted!',
              options: {
                variant: 'success',
              },
            }),
          ),
        ),
        catchError(() =>
          of(
            snackbarsEnqueue({
              message: 'Failed to delete activity!',
              options: {
                variant: 'error',
              },
            }),
          ),
        ),
      ),
    ),
  );

export default combineEpics(
  loadAnnouncementsEpic,
  createAnnouncementEpic,
  editAnnouncementEpic,
  deleteAnnouncementEpic,
);

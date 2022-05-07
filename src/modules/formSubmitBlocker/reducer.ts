import { createReducer, isAnyOf } from '@reduxjs/toolkit';

import {
  activitiesAddActivity,
  activitiesCreateActivityProposal,
  activitiesEditActivityProposal,
  activitiesEditActivityRequest,
} from '../activitites/actions';
import {
  announcementsAddAnnouncement,
  announcementsCreateAnnouncementProposal,
  announcementsEditAnnouncementProposal,
  announcementsEditAnnouncementRequest,
} from '../announcements/actions';
import { AppActions } from '../app/actions';
import {
  authAuthorizeUserProposal,
  authChangeSubmitErrorRequest,
  authLoginSubmitProposal,
  authRegisterSubmitProposal,
} from '../auth/actions';
import {
  expensesAddExpense,
  expensesCreateExpenseProposal,
  expensesEditExpenseProposal,
  expensesEditExpenseRequest,
} from '../expenses/actions';
import { invitationsInviteUsersToMeeting } from '../invitations/actions';
import {
  meetingsAddMeeting,
  meetingsAddUsersToMeeting,
  meetingsCreateMeetingProposal,
  meetingsMeetingPollDatesResponseChangeRequest,
  meetingsMeetingPollDatesResponseChangeSuccess,
  meetingsModifyMeeting,
  meetingsUpdateMeetingRequest,
} from '../meetings/actions';
import { snackbarsEnqueue } from '../snackbars/actions';

export interface FormSubmitBlockerState {
  isSubmitting: boolean;
}

const initialState: FormSubmitBlockerState = {
  isSubmitting: false,
};

const submitActions = [
  activitiesEditActivityProposal,
  activitiesCreateActivityProposal,
  announcementsEditAnnouncementProposal,
  announcementsCreateAnnouncementProposal,
  authLoginSubmitProposal,
  authRegisterSubmitProposal,
  expensesEditExpenseProposal,
  expensesCreateExpenseProposal,
  invitationsInviteUsersToMeeting,
  meetingsCreateMeetingProposal,
  meetingsUpdateMeetingRequest,
  meetingsMeetingPollDatesResponseChangeRequest,
];
const submitEndActions = [
  activitiesAddActivity,
  activitiesEditActivityRequest,
  announcementsAddAnnouncement,
  announcementsEditAnnouncementRequest,
  authChangeSubmitErrorRequest,
  authAuthorizeUserProposal,
  expensesAddExpense,
  expensesEditExpenseRequest,
  meetingsAddUsersToMeeting,
  meetingsAddMeeting,
  meetingsModifyMeeting,
  meetingsMeetingPollDatesResponseChangeSuccess,
];

const isSubmitAction = (action: AppActions) =>
  isAnyOf(submitActions[0], ...submitActions.slice(1))(action);

const isEndAction = (action: AppActions) =>
  isAnyOf(submitEndActions[0], ...submitEndActions.slice(1))(action) ||
  (snackbarsEnqueue.match(action) &&
    action.payload.message === 'Account successfully created!') ||
  (snackbarsEnqueue.match(action) &&
    action.payload.options.variant === 'error');

const formSubmitBlockerReducer = createReducer(initialState, (builder) =>
  builder
    .addMatcher(isSubmitAction, (state) => {
      state.isSubmitting = true;
    })
    .addMatcher(isEndAction, (state) => {
      state.isSubmitting = false;
    }),
);

export default formSubmitBlockerReducer;

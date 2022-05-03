import { createAction } from '@reduxjs/toolkit';

import { withPayloadType } from '../app/actions';
import type { IParticipant } from '../auth/reducer';
import type { ParticipationStatus } from '../invitations/reducer';

import type {
  IMeeting,
  MeetingTabs,
  IMeetingDatesPollEntry,
  MeetingStatus,
  updateRequest,
  MeetingTypes,
} from './reducer';

export const meetingsCreateDialogVisibleChangeRequest = createAction(
  'meetings/createDialogVisibleChangeRequest',
  withPayloadType<boolean>(),
);

interface ICreateMeetingRequest {
  name: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  locationId: string | null;
  locationString: string | null;
  isDatesPollActive: boolean;
  canUsersAddPollEntries: boolean;
  participantIds: number[];
  datesPollEntries: Array<{ startDate: string; endDate: string }> | null;
}

export const meetingsCreateMeetingProposal = createAction(
  'meetings/createMeetingProposal',
  withPayloadType<ICreateMeetingRequest>(),
);

export const meetingsLoadMeetingsProposal = createAction(
  'meetings/loadMeetingsProposal',
  (page: number, typeOfMeeting: MeetingTypes) => ({
    payload: { page, typeOfMeeting },
  }),
);

export const meetingsLoadMeetingsSuccess = createAction(
  'meetings/loadMeetingsSuccess',
  (
    meetings: IMeeting[],
    meetingCount: number,
    typeOfMeeting: MeetingTypes,
  ) => ({
    payload: { meetings, meetingCount, typeOfMeeting },
  }),
);

export const meetingsLoadMeetingsFail = createAction(
  'meetings/loadMeetingsFail',
  withPayloadType<MeetingTypes>(),
);

export const meetingsAddMeeting = createAction(
  'meetings/addMeeting',
  (meeting: IMeeting, typeOfMeeting?: MeetingTypes) => ({
    payload: { meeting, typeOfMeeting },
  }),
);

export const meetingsSwitchToTab = createAction(
  'meetings/switchToTab',
  withPayloadType<MeetingTabs>(),
);

export const meetingsLoadMeetingProposal = createAction(
  'meetings/loadMeetingProposal',
  withPayloadType<number>(),
);

export const meetingsMeetingPollDialogVisibleChangeRequest = createAction(
  'meetings/meetingPollDialogChangeRequest',
  withPayloadType<number | null>(),
);

export const meetingsMeetingPollDatesResponseChangeRequest = createAction(
  'meetings/meetingPollDatesResponseChangeRequest',
  withPayloadType<{
    votes: { [id: string]: boolean };
    newMeetingDatesPollEntries: Array<{ startDate: Date; endDate: Date }>;
    meetingId: number;
  }>(),
);

export const meetingsMeetingPollDatesResponseChangeSuccess = createAction(
  'meetings/meetingPollDatesResponseChangeSuccess',
  withPayloadType<{ entries: IMeetingDatesPollEntry[]; meetingId: number }>(),
);

export const meetingsLoadMeetingFail = createAction('meetings/loadMeetingFail');

export const meetingsChangeParticipantStatusProposal = createAction(
  'meetings/changeParticipantStatusProposal',
  (meetingId: number, userId: number, status: ParticipationStatus) => ({
    payload: { meetingId, userId, status },
  }),
);

export const meetingsChangeUserParticipationStatus = createAction(
  'meetings/changeUserParticipationStatus',
  (meetingId: number, userId: number, status: ParticipationStatus) => ({
    payload: { meetingId, userId, status },
  }),
);

export const meetingsAddUsersToMeeting = createAction(
  'meetings/addUsersToMeeting',
  (meetingId: number, newUsers: IParticipant[]) => ({
    payload: { meetingId, newUsers },
  }),
);

export const meetingsEditModeChange = createAction(
  'meetings/editModeChange',
  withPayloadType<number | null>(),
);

export interface IUpdateMeetingRequest {
  name: string;
  description: string;
  locationId?: string | null;
  locationString?: string | null;
  status: MeetingStatus;
  startDate: string | null;
  endDate: string | null;
}

export const meetingsUpdateMeetingRequest = createAction(
  'meetings/updateMeetingRequest',
  (meetingId: number, data: IUpdateMeetingRequest) => ({
    payload: {
      meetingId,
      data,
    },
  }),
);

export const meetingsModifyMeeting = createAction(
  'meetings/modifyMeeting',
  (id: number, meeting: Partial<IMeeting>) => ({ payload: { id, meeting } }),
);

export const meetingsChangeCancelingMeeting = createAction(
  'meetings/changeCancelingMeeting',
  withPayloadType<typeof updateRequest.payload | null>(),
);

export const meetingsRespondToCancelingMeeting = createAction(
  'meetings/respondToCancelingMeeting',
  withPayloadType<boolean>(),
);

export type MeetingsActions =
  | ReturnType<typeof meetingsCreateDialogVisibleChangeRequest>
  | ReturnType<typeof meetingsCreateMeetingProposal>
  | ReturnType<typeof meetingsLoadMeetingsProposal>
  | ReturnType<typeof meetingsLoadMeetingsSuccess>
  | ReturnType<typeof meetingsLoadMeetingsFail>
  | ReturnType<typeof meetingsAddMeeting>
  | ReturnType<typeof meetingsSwitchToTab>
  | ReturnType<typeof meetingsLoadMeetingProposal>
  | ReturnType<typeof meetingsLoadMeetingFail>
  | ReturnType<typeof meetingsMeetingPollDialogVisibleChangeRequest>
  | ReturnType<typeof meetingsMeetingPollDatesResponseChangeRequest>
  | ReturnType<typeof meetingsMeetingPollDatesResponseChangeSuccess>
  | ReturnType<typeof meetingsChangeParticipantStatusProposal>
  | ReturnType<typeof meetingsChangeUserParticipationStatus>
  | ReturnType<typeof meetingsAddUsersToMeeting>
  | ReturnType<typeof meetingsEditModeChange>
  | ReturnType<typeof meetingsModifyMeeting>
  | ReturnType<typeof meetingsChangeCancelingMeeting>
  | ReturnType<typeof meetingsRespondToCancelingMeeting>;

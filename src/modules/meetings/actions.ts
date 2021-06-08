import { createAction } from '@reduxjs/toolkit';
import { withPayloadType } from '../app/actions';
import type { IUserInvitation } from '../auth/reducer';
import type { ParticipationStatus } from '../invitations/reducer';
import type {
  IMeeting,
  MeetingTabs,
  IMeetingDatesPollEntry,
  MeetingStatus,
  updateRequest,
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
  (page: number, typeOfMeeting: string) => ({
    payload: { page, typeOfMeeting },
  }),
);

export const meetingsLoadMeetingsSuccess = createAction(
  'meetings/loadMeetingsSuccess',
  (meetings: IMeeting[], meetingCount: number, typeOfMeeting: string) => ({
    payload: { meetings, meetingCount, typeOfMeeting },
  }),
);

export const meetingsLoadMeetingsFail = createAction(
  'meetings/loadMeetingsFail',
);

export const meetingsAddMeeting = createAction(
  'meetings/addMeeting',
  withPayloadType<IMeeting>(),
);

export const meetingsSwitchToTab = createAction(
  'meetings/switchToTab',
  withPayloadType<MeetingTabs>(),
);

interface ILoadMeetingRequest {
  id: number;
}

export const meetingsLoadMeetingRequest = createAction(
  'meetings/loadMeetingProposal',
  withPayloadType<ILoadMeetingRequest>(),
);

export const meetingsMeetingPollDialogVisibleChangeRequest = createAction(
  'meetings/meetingPollDialogChangeRequest',
  withPayloadType<number | null>(),
);

export const meetingsMeetingPollDatesResponseChangeRequest = createAction(
  'meetings/meetingPollDatesResponseChangeRequest',
  withPayloadType<{
    votes: Array<{ [id: string]: boolean }>;
    newMeetingDatesPollEntries: Array<{ startDate: Date; endDate: Date }>
    meetingId: number;
  }>(),
);

export const meetingsMeetingPollDatesResponseChangeSuccess = createAction(
  'meetings/meetingPollDatesResponseChangeSuccess',
  withPayloadType<{ entries: IMeetingDatesPollEntry[]; meetingId: number }>(),
);

export const meetingsLoadMeetingFail = createAction('meetings/loadMeetingFail');

interface IParticipationStatusRequest {
  status: ParticipationStatus;
  id: number;
  userEmail: string;
}

export const meetingsChangeParticipantStatusProposal = createAction(
  'meetings/changeParticipantStatusProposal',
  withPayloadType<IParticipationStatusRequest>(),
);

export const meetingsChangeUserParticipationStatus = createAction(
  'meetings/changeUserParticipationStatus',
  (meetingId: number, newStatus: ParticipationStatus, userEmail: string) => ({
    payload: { meetingId, newStatus, userEmail },
  }),
);

export const meetingsAddUsersToMeeting = createAction(
  'meetings/addUsersToMeeting',
  (meetingId: number, newUsers: IUserInvitation[]) => ({
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
  withPayloadType<Partial<IMeeting>>(),
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
  | ReturnType<typeof meetingsLoadMeetingRequest>
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

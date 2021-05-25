import { createAction } from '@reduxjs/toolkit';
import { withPayloadType } from '../app/actions';
import type { IUser } from '../auth/reducer';
import type { ParticipationStatus } from '../invitations/reducer';
import type { IMeeting, MeetingTabs } from './reducer';

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
  (page: number) => ({ payload: { page } }),
);

export const meetingsLoadMeetingsSuccess = createAction(
  'meetings/loadMeetingsSuccess',
  (meetings: IMeeting[], meetingCount: number) => ({
    payload: { meetings, meetingCount },
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

export const meetingsLoadMeetingFail = createAction('meetings/loadMeetingFail');

interface IParticipationStatusRequest {
  status: ParticipationStatus;
  id: number;
  userEmail: string;
}

export const meetingsChangeParticipantStatusProposal = createAction(
  'meetings/changeParticipantStatusProposal',
  withPayloadType<IParticipationStatusRequest>(),
)

export const meetingsChangeUserParticipationStatus = createAction(
  'meetings/changeUserParticipationStatus',
  (meetingId: number, newStatus: ParticipationStatus, userEmail: string) => ({
    payload: { meetingId, newStatus, userEmail },
  }),
)

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
  | ReturnType<typeof meetingsChangeParticipantStatusProposal>
  | ReturnType<typeof meetingsChangeUserParticipationStatus>;

import { createAction } from '@reduxjs/toolkit';
import { withPayloadType } from '../app/actions';
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

export const meetingsLoadMeetingFail = createAction('meetings/loadMeetingFail');

export type MeetingsActions =
  | ReturnType<typeof meetingsCreateDialogVisibleChangeRequest>
  | ReturnType<typeof meetingsCreateMeetingProposal>
  | ReturnType<typeof meetingsLoadMeetingsProposal>
  | ReturnType<typeof meetingsLoadMeetingsSuccess>
  | ReturnType<typeof meetingsLoadMeetingsFail>
  | ReturnType<typeof meetingsAddMeeting>
  | ReturnType<typeof meetingsSwitchToTab>
  | ReturnType<typeof meetingsLoadMeetingRequest>
  | ReturnType<typeof meetingsLoadMeetingFail>;

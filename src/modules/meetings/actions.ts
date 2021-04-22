import { createAction } from '@reduxjs/toolkit';
import { withPayloadType } from '../app/actions';
import type { IMeeting } from './reducer';

export const meetingsCreateDialogVisibleChangeRequest = createAction(
  'meetings/createDialogVisibleChangeRequest',
  withPayloadType<boolean>(),
);

interface ICreateMeetingRequest {
  name: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  locationId: string | null;
  locationString: string | null;
  isDatesPollActive: boolean;
  canUsersAddPollEntries: boolean;
  participantIds: number[];
}

export const meetingsCreateMeetingProposal = createAction(
  'meetings/createMeetingProposal',
  withPayloadType<ICreateMeetingRequest>(),
);

export const meetingsLoadMeetingsProposal = createAction(
  'meetings/loadMeetingsProposal',
);

export const meetingsLoadMeetingsSuccess = createAction(
  'meetings/loadMeetingsSuccess',
  withPayloadType<IMeeting[]>(),
);

export const meetingsAddMeeting = createAction(
  'meetings/addMeeting',
  withPayloadType<IMeeting>(),
);

export type MeetingsActions =
  | ReturnType<typeof meetingsCreateDialogVisibleChangeRequest>
  | ReturnType<typeof meetingsCreateMeetingProposal>
  | ReturnType<typeof meetingsLoadMeetingsProposal>
  | ReturnType<typeof meetingsLoadMeetingsSuccess>
  | ReturnType<typeof meetingsAddMeeting>;

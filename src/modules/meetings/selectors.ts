import type { RootState } from '../app/reducer';
import type { IMeeting } from './reducer';

export const meetingsPlannedSelector = (state: RootState): IMeeting[] =>
  state.meetings.plannedMeetings;

export const meetingsIsCreateDialogOpenSelector = (state: RootState): boolean =>
  state.meetings.isCreateDialogOpen;

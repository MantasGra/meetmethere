import type { RootState } from '../app/reducer';
import type { IUser } from '../auth/reducer';
import type { IExpense } from './reducer';

export const expensesLoadingSelector = (state: RootState): boolean =>
  state.expenses.expensesLoading;

export const expensesHasMoreSelector = (state: RootState): boolean =>
  state.expenses.expensesIds.length <
  state.expenses.expensesCount;

export const expensesListSelector = (state: RootState): IExpense[] =>
  state.expenses.expensesIds.map(
    (value) => state.expenses.expenses[value],
  );

export const expensesLoadFailedSelector = (state: RootState): boolean =>
  state.expenses.expensesLoadFailed;

export const expensesFormDialogMeetingIdSelector = (
  state: RootState,
): null | number => state.expenses.formDialogMeetingId;

export const expensesIsFormDialogOpenSelector = (
  state: RootState,
): boolean => !!state.expenses.formDialogMeetingId;

export const expensesMeetingParticipantSelector = (
  state: RootState,
): IUser[] | null => 
  state.expenses.formDialogMeetingId
    ? state.meetings.plannedMeetings[state.expenses.formDialogMeetingId].participants
    : null;

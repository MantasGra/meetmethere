import type { RootState } from '../app/reducer';
import type { IUser } from '../auth/reducer';
import type { IExpense, IExpenseIdentifier } from './reducer';

export const expensesLoadingSelector = (state: RootState): boolean =>
  state.expenses.expensesLoading;

export const expensesHasMoreSelector = (state: RootState): boolean =>
  state.expenses.expensesIds.length < state.expenses.expensesCount;

export const expensesListSelector = (state: RootState): IExpense[] =>
  state.expenses.expensesIds.map((value) => state.expenses.expenses[value]);

export const expensesLoadFailedSelector = (state: RootState): boolean =>
  state.expenses.expensesLoadFailed;

export const expensesFormDialogMeetingIdSelector = (
  state: RootState,
): null | number =>
  state.expenses.formDialogExpenseIdentifier
    ? state.expenses.formDialogExpenseIdentifier.meetingId
    : null;

export const expensesFormDialogExpenseIdentifierSelector = (
  state: RootState,
): IExpenseIdentifier | null => state.expenses.formDialogExpenseIdentifier;

export const expensesFormDialogExpenseSelector = (
  state: RootState,
): IExpense | null => {
  if (
    !state.expenses.formDialogExpenseIdentifier ||
    state.expenses.formDialogExpenseIdentifier.expenseId == null
  ) {
    return null;
  }
  const expense =
    state.expenses.expenses[
      state.expenses.formDialogExpenseIdentifier.expenseId
    ];
  if (!!expense) {
    return expense;
  }
  return null;
};

export const expensesIsFormDialogOpenSelector = (state: RootState): boolean =>
  !!state.expenses.formDialogExpenseIdentifier;

export const expensesMeetingParticipantSelector = (
  state: RootState,
): IUser[] | null =>
  state.expenses.formDialogExpenseIdentifier
    ? state.meetings.plannedMeetings[
        state.expenses.formDialogExpenseIdentifier.meetingId
      ].participants
    : null;

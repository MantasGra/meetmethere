import { createSelector } from '@reduxjs/toolkit';
import { toOrderedList } from 'src/utils/transformators';

import type { RootState } from '../app/reducer';
import type { IAccount } from '../auth/reducer';
import { authStateAccountSelector } from '../auth/selectors';
import { meetingsMapSelector } from '../meetings/selectors';

import type { IExpense, ExpensesState } from './reducer';

export const expensesStateSelector = (state: RootState): ExpensesState =>
  state.expenses;

export const expensesLoadingSelector = createSelector(
  expensesStateSelector,
  (expensesState) => expensesState.expensesLoading,
);

export const expensesIdsSelector = createSelector(
  expensesStateSelector,
  (expensesState) => expensesState.expensesIds,
);

export const expensesMapSelector = createSelector(
  expensesStateSelector,
  (expensesState) => expensesState.expenses,
);

export const expensesListSelector = createSelector(
  expensesIdsSelector,
  expensesMapSelector,
  (ids, activities) => toOrderedList(ids, activities),
);

export const expensesLoadFailedSelector = createSelector(
  expensesStateSelector,
  (expensesState) => expensesState.expensesLoadFailed,
);

export const expensesFormDialogMeetingIdSelector = createSelector(
  expensesStateSelector,
  (expensesState) => expensesState.formDialogMeetingId,
);

export const expensesFormDialogExpenseIdSelector = createSelector(
  expensesStateSelector,
  (expensesState) => expensesState.formDialogExpenseId,
);

export const expensesIsFormDialogOpenSelector = createSelector(
  expensesFormDialogMeetingIdSelector,
  (meetingId) => !!meetingId,
);

export const expensesIsFormEditSelector = createSelector(
  expensesFormDialogExpenseIdSelector,
  (expenseId) => !!expenseId,
);

export const expensesEditedExpenseSelector = createSelector(
  expensesFormDialogExpenseIdSelector,
  expensesMapSelector,
  (expenseId, expenses) => (expenseId ? expenses[expenseId] : null),
);

export const expensesMeetingParticipantSelector = createSelector(
  meetingsMapSelector,
  expensesFormDialogMeetingIdSelector,
  (meetings, meetingId) => (meetingId ? meetings[meetingId].participants : []),
);

const getTotalExpenses = (expenses: IExpense[], account?: IAccount) => {
  if (!account) {
    return 0;
  }
  return expenses
    .filter((expense) =>
      expense.users.map((user) => user.id).includes(account.id),
    )
    .reduce((sum, expense) => sum + expense.amount / expense.users.length, 0);
};

export const expensesTotalSelector = createSelector(
  expensesListSelector,
  authStateAccountSelector,
  getTotalExpenses,
);

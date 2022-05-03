import { createAction } from '@reduxjs/toolkit';

import { withPayloadType } from '../app/actions';

import { IExpenseForm } from './components/ExpenseForm';
import type { IExpense } from './reducer';

export const expensesLoadExpensesProposal = createAction(
  'expenses/loadExpensesProposal',
  withPayloadType<number>(),
);

export const expensesLoadExpensesSuccess = createAction(
  'expenses/loadExpensesSuccess',
  withPayloadType<IExpense[]>(),
);

export const expensesLoadExpensesFail = createAction(
  'expenses/loadExpensesFail',
);

export const expensesCreateExpenseProposal = createAction(
  'expenses/createExpenseProposal',
  (expense: IExpenseForm, meetingId: number) => ({
    payload: {
      expense,
      meetingId,
    },
  }),
);

export const expensesEditExpenseProposal = createAction(
  'expenses/editExpenseProposal',
  (expense: IExpenseForm, meetingId: number, expenseId: number) => ({
    payload: {
      expense,
      meetingId,
      expenseId,
    },
  }),
);

export const expensesDeleteExpenseProposal = createAction(
  'expenses/deleteExpenseProposal',
  (meetingId: number, expenseId: number) => ({
    payload: {
      expenseId,
      meetingId,
    },
  }),
);

export const expensesAddExpense = createAction(
  'expenses/addExpense',
  withPayloadType<IExpense>(),
);

export const expensesEditExpenseRequest = createAction(
  'expenses/editExpenseRequest',
  withPayloadType<IExpense>(),
);

export const expensesDeleteExpenseRequest = createAction(
  'expenses/deleteExpense',
  withPayloadType<number>(),
);

export const expensesFormDialogMeetingIdChangeRequest = createAction(
  'expenses/formDialogMeetingIdChangeRequest',
  withPayloadType<number | null>(),
);

export const expensesEditExpenseIdChange = createAction(
  'expenses/editExpenseIdChange',
  (meetingId: number | null, expenseId: number | null) => ({
    payload: { meetingId, expenseId },
  }),
);

export type ExpensesActions =
  | ReturnType<typeof expensesLoadExpensesProposal>
  | ReturnType<typeof expensesLoadExpensesSuccess>
  | ReturnType<typeof expensesLoadExpensesFail>
  | ReturnType<typeof expensesCreateExpenseProposal>
  | ReturnType<typeof expensesEditExpenseProposal>
  | ReturnType<typeof expensesAddExpense>
  | ReturnType<typeof expensesEditExpenseRequest>
  | ReturnType<typeof expensesDeleteExpenseRequest>
  | ReturnType<typeof expensesDeleteExpenseProposal>
  | ReturnType<typeof expensesFormDialogMeetingIdChangeRequest>
  | ReturnType<typeof expensesEditExpenseIdChange>;

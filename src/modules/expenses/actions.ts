import { createAction } from '@reduxjs/toolkit';
import { withPayloadType } from '../app/actions';
import type { IExpense, IExpenseIdentifier } from './reducer';

export const expensesLoadExpensesProposal = createAction(
  'expenses/loadExpensesProposal',
  (meetingId: number, page: number) => ({ payload: { page, meetingId } }),
);

export const expensesLoadExpensesSuccess = createAction(
  'expenses/loadExpensesSuccess',
  (expenses: IExpense[], announcementCount: number) => ({
    payload: { expenses, announcementCount },
  }),
);

export const expensesLoadExpensesFail = createAction(
  'expenses/loadExpensesFail',
);

export interface IExpenseCreateRequest {
  name: string;
  description: string;
  amount: number;
  userIds: number[];
}

export const expensesCreateExpenseProposal = createAction(
  'expenses/createExpenseProposal',
  (expense: IExpenseCreateRequest, meetingId: number) => ({
    payload: {
      expense,
      meetingId,
    },
  }),
);

export interface IExpenseEditRequest {
  id: number;
  name: string;
  description: string;
  amount: number;
  userIds: number[];
}

export const expensesEditExpenseProposal = createAction(
  'expenses/editExpenseProposal',
  (expense: IExpenseEditRequest, meetingId: number) => ({
    payload: {
      expense,
      meetingId,
    },
  }),
);

export const expensesDeleteExpenseProposal = createAction(
  'expenses/deleteExpenseProposal',
  (expense: IExpense, meetingId: number) => ({
    payload: {
      expense,
      meetingId,
    },
  }),
);

export const expensesAddExpense = createAction(
  'expenses/addExpense',
  withPayloadType<IExpense>(),
);

export const expensesChangeExpense = createAction(
  'expenses/changeExpense',
  withPayloadType<IExpense>(),
);

export const expensesDeleteExpense = createAction(
  'expenses/deleteExpense',
  withPayloadType<IExpense>(),
);

export const expensesFormDialogMeetingIdChangeRequest = createAction(
  'expenses/formDialogMeetingIdChangeRequest',
  withPayloadType<number | null>(),
);

export const expensesFormDialogExpenseIdentifierChangeRequest = createAction(
  'expenses/formDialogExpenseIdentifierChangeRequest',
  withPayloadType<IExpenseIdentifier | null>(),
);

export type ExpensesActions =
  | ReturnType<typeof expensesLoadExpensesProposal>
  | ReturnType<typeof expensesLoadExpensesSuccess>
  | ReturnType<typeof expensesLoadExpensesFail>
  | ReturnType<typeof expensesCreateExpenseProposal>
  | ReturnType<typeof expensesCreateExpenseProposal>
  | ReturnType<typeof expensesAddExpense>
  | ReturnType<typeof expensesChangeExpense>
  | ReturnType<typeof expensesDeleteExpense>
  | ReturnType<typeof expensesDeleteExpenseProposal>
  | ReturnType<typeof expensesFormDialogMeetingIdChangeRequest>
  | ReturnType<typeof expensesFormDialogExpenseIdentifierChangeRequest>;

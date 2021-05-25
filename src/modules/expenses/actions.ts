import { createAction } from "@reduxjs/toolkit";
import { withPayloadType } from "../app/actions";
import type { IUser } from "../auth/reducer";
import type { IMeeting } from "../meetings/reducer";
import type { IExpense } from "./reducer";

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
    users: IUser[];
    meeting: IMeeting;
  }

  export const expensesCreateExpenseProposal = createAction(
    'expenses/createExpenseProposal',
    (announcement: IExpenseCreateRequest, meetingId: number) => ({
      payload: {
        announcement,
        meetingId,
      },
    }),
  );
  
  export const expensesAddExpense = createAction(
    'expenses/addExpense',
    withPayloadType<IExpense>(),
  );

  export const expensesFormDialogMeetingIdChangeRequest = createAction(
    'expenses/formDialogMeetingIdChangeRequest',
    withPayloadType<number | null>(),
  );

  export type ExpensesActions =
  | ReturnType<typeof expensesLoadExpensesProposal>
  | ReturnType<typeof expensesLoadExpensesSuccess>
  | ReturnType<typeof expensesLoadExpensesFail>
  | ReturnType<typeof expensesCreateExpenseProposal>
  | ReturnType<typeof expensesCreateExpenseProposal>
  | ReturnType<typeof expensesAddExpense>
  | ReturnType<typeof expensesFormDialogMeetingIdChangeRequest>;
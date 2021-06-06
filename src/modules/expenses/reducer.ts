import { createReducer } from '@reduxjs/toolkit';
import { compareDesc } from 'date-fns';
import type { IUser } from '../auth/reducer';
import type { IMeeting } from '../meetings/reducer';
import {
  expensesAddExpense,
  expensesChangeExpense,
  expensesDeleteExpense,
  expensesFormDialogExpenseIdentifierChangeRequest,
  expensesFormDialogMeetingIdChangeRequest,
  expensesLoadExpensesFail,
  expensesLoadExpensesProposal,
  expensesLoadExpensesSuccess,
} from './actions';

export interface IExpense {
  id: number;
  name: string;
  description: string;
  amount: number;
  users: IUser[];
  createdBy: IUser;
  meeting: IMeeting;
  createDate: Date;
}

export interface IExpenseIdentifier {
  meetingId: number;
  expenseId: number | null;
}

interface ExpensesState {
  expensesLoading: boolean;
  expensesIds: number[];
  expenses: Record<number, IExpense>;
  expensesCount: number;
  expensesLoadFailed: boolean;
  formDialogExpenseIdentifier: IExpenseIdentifier | null;
}

const initialState: ExpensesState = {
  expensesLoading: false,
  expensesIds: [],
  expenses: {},
  expensesCount: 0,
  expensesLoadFailed: false,
  formDialogExpenseIdentifier: null,
};

const expensesReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(expensesLoadExpensesProposal, (state, action) => {
      state.expensesLoading = true;
      if (action.payload.page === 1) {
        state.expenses = {};
        state.expensesIds = [];
        state.expensesCount = 0;
      }
    })
    .addCase(expensesLoadExpensesSuccess, (state, action) => {
      action.payload.expenses.forEach((expense) => {
        state.expenses[expense.id] = expense;
        if (!state.expensesIds.includes(expense.id)) {
          state.expensesIds.push(expense.id);
        }
      });
      state.expensesIds = state.expensesIds.sort(compareDesc);
      state.expensesCount = action.payload.announcementCount;
      state.expensesLoading = false;
      state.expensesLoadFailed = false;
    })
    .addCase(expensesLoadExpensesFail, (state) => {
      state.expensesLoadFailed = true;
      state.expensesLoading = false;
    })
    .addCase(expensesAddExpense, (state, action) => {
      state.expenses[action.payload.id] = action.payload;
      state.expensesIds.unshift(action.payload.id);
    })
    .addCase(expensesChangeExpense, (state, action) => {
      state.expenses[action.payload.id] = action.payload;
    })
    .addCase(expensesDeleteExpense, (state, action) => {
      delete state.expenses[action.payload.id];
    })
    .addCase(expensesFormDialogMeetingIdChangeRequest, (state, action) => {
      state.formDialogExpenseIdentifier = action.payload
        ? { meetingId: action.payload, expenseId: null }
        : null;
    })
    .addCase(
      expensesFormDialogExpenseIdentifierChangeRequest,
      (state, action) => {
        state.formDialogExpenseIdentifier = action.payload;
      },
    ),
);

export default expensesReducer;

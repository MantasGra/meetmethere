import { createReducer } from '@reduxjs/toolkit';
import { keyBy } from 'lodash';

import type { IUser } from '../auth/reducer';

import {
  expensesAddExpense,
  expensesEditExpenseRequest,
  expensesDeleteExpenseRequest,
  expensesEditExpenseIdChange,
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
}

export interface ExpensesState {
  expensesLoading: boolean;
  expensesIds: number[];
  expenses: Record<number, IExpense>;
  expensesLoadFailed: boolean;
  formDialogMeetingId: number | null;
  formDialogExpenseId: number | null;
}

const initialState: ExpensesState = {
  expensesLoading: false,
  expensesIds: [],
  expenses: {},
  expensesLoadFailed: false,
  formDialogMeetingId: null,
  formDialogExpenseId: null,
};

const expensesReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(expensesLoadExpensesProposal, (state) => {
      state.expensesLoading = true;
      state.expenses = {};
      state.expensesIds = [];
    })
    .addCase(expensesLoadExpensesSuccess, (state, action) => {
      state.expenses = keyBy(action.payload, 'id');
      state.expensesIds = action.payload.map((activity) => activity.id);
      state.expensesLoading = false;
      state.expensesLoadFailed = false;
    })
    .addCase(expensesLoadExpensesFail, (state) => {
      state.expensesLoadFailed = true;
      state.expensesLoading = false;
    })
    .addCase(expensesAddExpense, (state, action) => {
      state.expenses[action.payload.id] = action.payload;
      state.expensesIds.push(action.payload.id);
    })
    .addCase(expensesEditExpenseRequest, (state, action) => {
      state.expenses[action.payload.id] = action.payload;
    })
    .addCase(expensesDeleteExpenseRequest, (state, action) => {
      delete state.expenses[action.payload];
      state.expensesIds = state.expensesIds.filter(
        (id) => id !== action.payload,
      );
    })
    .addCase(expensesFormDialogMeetingIdChangeRequest, (state, action) => {
      state.formDialogMeetingId = action.payload;
    })
    .addCase(expensesEditExpenseIdChange, (state, action) => {
      state.formDialogExpenseId = action.payload.expenseId;
      state.formDialogMeetingId = action.payload.meetingId;
    }),
);

export default expensesReducer;

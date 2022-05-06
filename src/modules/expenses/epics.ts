import { combineEpics } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, map, mergeMap, pluck } from 'rxjs/operators';
import { fromAxios, ofActionType } from 'src/utils/operators';

import type { AppEpic } from '../app/epics';
import { snackbarsEnqueue } from '../snackbars/actions';

import {
  expensesAddExpense,
  expensesEditExpenseRequest,
  expensesCreateExpenseProposal,
  expensesDeleteExpenseRequest,
  expensesDeleteExpenseProposal,
  expensesEditExpenseProposal,
  expensesEditExpenseIdChange,
  expensesFormDialogMeetingIdChangeRequest,
  expensesLoadExpensesFail,
  expensesLoadExpensesProposal,
  expensesLoadExpensesSuccess,
} from './actions';
import type { IExpense } from './reducer';

const loadExpensesEpic: AppEpic = (action$, _, { axios }) =>
  action$.pipe(
    ofActionType(expensesLoadExpensesProposal),
    pluck('payload'),
    mergeMap((meetingId) =>
      fromAxios<IExpense[]>(axios, {
        url: `/meeting/${meetingId}/expenses`,
        method: 'GET',
        withCredentials: true,
      }).pipe(
        map((response) => expensesLoadExpensesSuccess(response.data)),
        catchError(() => of(expensesLoadExpensesFail())),
      ),
    ),
  );

const createExpenseEpic: AppEpic = (action$, _, { axios }) =>
  action$.pipe(
    ofActionType(expensesCreateExpenseProposal),
    pluck('payload'),
    mergeMap(({ expense, meetingId }) =>
      fromAxios<IExpense>(axios, {
        url: `/meeting/${meetingId}/expenses`,
        method: 'POST',
        data: expense,
        withCredentials: true,
      }).pipe(
        mergeMap((response) =>
          of(
            expensesAddExpense(response.data),
            expensesFormDialogMeetingIdChangeRequest(null),
            snackbarsEnqueue({
              message: 'Expense created!',
              options: {
                variant: 'success',
              },
            }),
          ),
        ),
        catchError(() =>
          of(
            snackbarsEnqueue({
              message: 'Expense creation failed!',
              options: {
                variant: 'error',
              },
            }),
          ),
        ),
      ),
    ),
  );

const editExpenseEpic: AppEpic = (action$, _, { axios }) =>
  action$.pipe(
    ofActionType(expensesEditExpenseProposal),
    pluck('payload'),
    mergeMap(({ expense, expenseId, meetingId }) =>
      fromAxios<IExpense>(axios, {
        url: `/meeting/${meetingId}/expenses/${expenseId}`,
        method: 'PATCH',
        data: expense,
        withCredentials: true,
      }).pipe(
        mergeMap((response) =>
          of(
            expensesEditExpenseRequest(response.data),
            expensesEditExpenseIdChange(null, null),
            snackbarsEnqueue({
              message: 'Expense changed!',
              options: {
                variant: 'success',
              },
            }),
          ),
        ),
        catchError(() =>
          of(
            snackbarsEnqueue({
              message: 'Expense edit failed!',
              options: {
                variant: 'error',
              },
            }),
          ),
        ),
      ),
    ),
  );

const deleteExpenseEpic: AppEpic = (action$, _, { axios }) =>
  action$.pipe(
    ofActionType(expensesDeleteExpenseProposal),
    pluck('payload'),
    mergeMap(({ expenseId, meetingId }) =>
      fromAxios<never>(axios, {
        url: `/meeting/${meetingId}/expenses/${expenseId}`,
        method: 'DELETE',
        withCredentials: true,
      }).pipe(
        mergeMap(() =>
          of(
            expensesDeleteExpenseRequest(expenseId),
            snackbarsEnqueue({
              message: 'Expense deleted!',
              options: {
                variant: 'success',
              },
            }),
          ),
        ),
        catchError(() =>
          of(
            snackbarsEnqueue({
              message: 'Expense deletion failed!',
              options: {
                variant: 'error',
              },
            }),
          ),
        ),
      ),
    ),
  );

export default combineEpics(
  loadExpensesEpic,
  createExpenseEpic,
  editExpenseEpic,
  deleteExpenseEpic,
);

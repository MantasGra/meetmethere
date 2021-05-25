import { combineEpics } from 'redux-observable';
import { of } from 'rxjs';
import { mergeMap, map, pluck, catchError } from 'rxjs/operators';
import { fromAxios, ofActionType } from 'src/utils/operators';
import type { AppEpic } from '../app/epics';
import { snackbarsEnqueue } from '../snackbars/actions';
import {
  expensesAddExpense,
  expensesCreateExpenseProposal,
  expensesFormDialogMeetingIdChangeRequest,
  expensesLoadExpensesFail,
  expensesLoadExpensesProposal,
  expensesLoadExpensesSuccess,
} from './actions';
import type { IExpense } from './reducer';

interface ILoadExpensesResponse {
  expenses: IExpense[];
  count: number;
}

const loadExpensesEpic: AppEpic = (action$, _, { axios }) =>
  action$.pipe(
    ofActionType(expensesLoadExpensesProposal),
    pluck('payload'),
    mergeMap(({ page, meetingId }) =>
      fromAxios<ILoadExpensesResponse>(axios, {
        url: `/meeting/${meetingId}/expenses`,
        method: 'GET',
        params: { page },
        withCredentials: true,
      }).pipe(
        map((response) =>
          expensesLoadExpensesSuccess(
            response.data.expenses,
            response.data.count,
          ),
        ),
        catchError(() => of(expensesLoadExpensesFail())),
      ),
    ),
  );

interface ICreateExpenseResponse {
  createdExpense: IExpense;
}

const createExpenseEpic: AppEpic = (action$, _, { axios }) =>
  action$.pipe(
    ofActionType(expensesCreateExpenseProposal),
    pluck('payload'),
    mergeMap(({ announcement, meetingId }) =>
      fromAxios<ICreateExpenseResponse>(axios, {
        url: `/meeting/${meetingId}/expenses`,
        method: 'POST',
        data: announcement,
        withCredentials: true,
      }).pipe(
        mergeMap((response) =>
          of(
            expensesAddExpense(response.data.createdExpense),
            expensesFormDialogMeetingIdChangeRequest(null),
            snackbarsEnqueue({
              message: 'Expense created!',
              options: {
                key: new Date().getTime() + Math.random(),
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
                key: new Date().getTime() + Math.random(),
                variant: 'error',
              },
            }),
          ),
        ),
      ),
    ),
  );

export default combineEpics(loadExpensesEpic, createExpenseEpic);

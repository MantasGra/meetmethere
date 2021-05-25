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

const loadExpensesEpic: AppEpic = (action$, _, { axios }) =>
  action$.pipe(
    ofActionType(expensesLoadExpensesProposal),
    pluck('payload'),
    mergeMap(({ page, meetingId }) =>
      fromAxios<IExpense[]>(axios, {
        url: `/meeting/${meetingId}/expenses`,
        method: 'GET',
        params: { page },
        withCredentials: true,
      }).pipe(
        map((response) =>
          expensesLoadExpensesSuccess(response.data, response.data.length),
        ),
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

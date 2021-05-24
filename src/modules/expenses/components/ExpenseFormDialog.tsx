import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import React from 'react';
import CloseableDialogTitle from 'src/components/CloseableDialogTitle';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import { expensesFormDialogExpenseIdentifierChangeRequest } from '../actions';
import { expensesFormDialogExpenseIdentifierSelector } from '../selectors';
import ExpenseForm from './ExpenseForm';

const ExpenseFormDialog: React.FC = () => {
  const expenseIdentifier = useAppSelector(
    expensesFormDialogExpenseIdentifierSelector,
  );

  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(expensesFormDialogExpenseIdentifierChangeRequest(null));
  };
  return (
    <Dialog open={expenseIdentifier?.meetingId != null} maxWidth="sm" fullWidth>
      <CloseableDialogTitle onClose={onClose}>
        {!expenseIdentifier?.expenseId ? 'Create Expense' : 'Edit Expense'}
      </CloseableDialogTitle>
      <DialogContent>
        <ExpenseForm />
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseFormDialog;

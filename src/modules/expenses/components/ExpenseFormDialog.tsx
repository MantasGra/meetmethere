import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CloseableDialogTitle from 'src/components/CloseableDialogTitle';
import ExpenseForm from './ExpenseForm';
import { useAppSelector, useAppDispatch } from 'src/hooks/redux';
import { expensesFormDialogMeetingIdChangeRequest } from '../actions';
import { expensesIsFormDialogOpenSelector } from '../selectors';

const ExpenseFormDialog: React.FC = () => {
  const open = useAppSelector(expensesIsFormDialogOpenSelector);

  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(expensesFormDialogMeetingIdChangeRequest(null));
  };
  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <CloseableDialogTitle onClose={onClose}>
        Create Expense
      </CloseableDialogTitle>
      <DialogContent>
        <ExpenseForm />
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseFormDialog;

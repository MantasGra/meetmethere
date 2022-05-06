import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useMemo } from 'react';
import CloseableDialogTitle from 'src/components/CloseableDialogTitle';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import usePreviousConditional from 'src/hooks/usePreviousConditional';

import { expensesEditExpenseIdChange } from '../actions';
import {
  expensesIsFormDialogOpenSelector,
  expensesIsFormEditSelector,
} from '../selectors';

import ExpenseForm from './ExpenseForm';

const ExpenseFormDialog: React.FC = () => {
  const open = useAppSelector(expensesIsFormDialogOpenSelector);
  const isFormEdit = useAppSelector(expensesIsFormEditSelector);

  const titleText = useMemo(
    () => `${isFormEdit ? 'Update' : 'Create'} Expense`,
    [isFormEdit],
  );

  const titleTextRendered = usePreviousConditional(titleText, !open);

  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(expensesEditExpenseIdChange(null, null));
  };
  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <CloseableDialogTitle onClose={onClose}>
        {titleTextRendered}
      </CloseableDialogTitle>
      <DialogContent>
        <ExpenseForm />
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseFormDialog;

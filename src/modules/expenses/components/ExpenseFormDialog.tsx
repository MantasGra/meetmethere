import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseableDialogTitle from 'src/components/CloseableDialogTitle';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';

import { expensesEditExpenseIdChange } from '../actions';
import {
  expensesIsFormDialogOpenSelector,
  expensesIsFormEditSelector,
} from '../selectors';

import ExpenseForm from './ExpenseForm';

const ExpenseFormDialog: React.FC = () => {
  const open = useAppSelector(expensesIsFormDialogOpenSelector);
  const isFormEdit = useAppSelector(expensesIsFormEditSelector);

  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(expensesEditExpenseIdChange(null, null));
  };
  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <CloseableDialogTitle onClose={onClose}>
        {!isFormEdit ? 'Create Expense' : 'Edit Expense'}
      </CloseableDialogTitle>
      <DialogContent>
        <ExpenseForm />
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseFormDialog;

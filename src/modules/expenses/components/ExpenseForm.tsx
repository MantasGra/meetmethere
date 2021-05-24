import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import type { IUser } from 'src/modules/auth/reducer';
import {
  expensesCreateExpenseProposal,
  expensesEditExpenseProposal,
  IExpenseCreateRequest,
  IExpenseEditRequest,
} from '../actions';
import {
  expensesFormDialogExpenseIdentifierSelector,
  expensesFormDialogExpenseSelector,
} from '../selectors';
import classes from './ExpenseForm.module.scss';
import ExpenseFormUserList from './ExpenseFormUserList';

interface ExpenseCreateRequest {
  name: string;
  description: string;
  amount: number;
  users: IUser[];
}

interface ExpenseEditRequest {
  id: number;
  name: string;
  description: string;
  amount: number;
  users: IUser[];
}

const ExpenseForm: React.FC = () => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ExpenseCreateRequest>();

  const description = watch('description', '');

  const expenseIdentifier = useAppSelector(
    expensesFormDialogExpenseIdentifierSelector,
  );
  const expenseToBeEdited = useAppSelector(expensesFormDialogExpenseSelector);
  const isEditMode =
    expenseToBeEdited !== null && expenseIdentifier?.expenseId !== null;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!!expenseToBeEdited) {
      reset({ ...expenseToBeEdited, users: expenseToBeEdited.users });
    }
  }, []);

  const submitNewExpense = (data: ExpenseCreateRequest) => {
    const postData: IExpenseCreateRequest = {
      name: data.name,
      description: data.description,
      amount: data.amount,
      userIds: data.users.map((u) => u.id),
    };
    if (expenseIdentifier?.meetingId) {
      dispatch(
        expensesCreateExpenseProposal(postData, expenseIdentifier.meetingId),
      );
    }
  };

  const submitEditExpense = (data: ExpenseEditRequest) => {
    const postData: IExpenseEditRequest = {
      id: data.id,
      name: data.name,
      description: data.description,
      amount: data.amount,
      userIds: data.users.map((u) => u.id),
    };
    if (expenseIdentifier?.meetingId) {
      dispatch(
        expensesEditExpenseProposal(postData, expenseIdentifier.meetingId),
      );
    }
  };

  const onSubmit = (data: ExpenseCreateRequest) => {
    if (expenseToBeEdited !== null && expenseIdentifier?.expenseId !== null) {
      submitEditExpense({ ...data, id: expenseIdentifier!.expenseId });
    } else if (
      expenseToBeEdited == null &&
      expenseIdentifier?.meetingId !== null
    ) {
      submitNewExpense(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        inputProps={{
          ...register('name', { required: 'Required' }),
          maxLength: 100,
        }}
        helperText={errors.name?.message}
        error={!!errors.name}
        margin="dense"
        variant="outlined"
        label="Title"
        fullWidth
      />
      <TextField
        inputProps={{
          ...register('amount', { validate: (value) => value > 0 }),
          step: '0.01',
        }}
        helperText={
          errors.amount?.type === 'validate'
            ? 'Value must be higher than 0'
            : undefined
        }
        error={!!errors.amount}
        margin="dense"
        variant="outlined"
        label="Amount"
        type="number"
        fullWidth
      />
      <TextField
        inputProps={{
          ...register('description'),
          maxLength: 500,
        }}
        helperText={`${description.length}/500`}
        FormHelperTextProps={{
          className: classes.helperTextRight,
        }}
        margin="dense"
        variant="outlined"
        label="Description"
        fullWidth
        multiline
        rows={4}
      />
      <div>
        <Controller
          control={control}
          defaultValue={
            !!expenseToBeEdited?.users ? expenseToBeEdited.users : []
          }
          name="users"
          rules={{
            validate: (value) => value.length !== 0,
          }}
          render={({ field }) => (
            <ExpenseFormUserList
              payeesList={field.value}
              onPayeesSelectedChange={(l) => field.onChange(l)}
              error={
                !!errors.users ? 'At least one participant must pay' : undefined
              }
            />
          )}
        />
      </div>
      <div className={classes.submitContainer}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.submitButton}
        >
          {isEditMode ? 'Edit' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;

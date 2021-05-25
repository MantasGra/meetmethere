import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import { expensesFormDialogMeetingIdSelector } from '../selectors';
import { expensesCreateExpenseProposal } from '../actions';
import classes from './ExpenseForm.module.scss';
import type { IExpenseCreateRequest } from '../actions';
import ExpenseFormUserList from './ExpenseFormUserList';
import type { IUser } from 'src/modules/auth/reducer';

interface ExpenseCreateRequest {
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
  } = useForm<ExpenseCreateRequest>();

  const description = watch('description', '');

  const meetingId = useAppSelector(expensesFormDialogMeetingIdSelector);

  const dispatch = useAppDispatch();

  const onSubmit = (data: ExpenseCreateRequest) => {
    const postData: IExpenseCreateRequest = {
      name: data.name,
      description: data.description,
      amount: data.amount,
      userIds: data.users.map((u) => u.id),
    };
    if (meetingId) {
      dispatch(expensesCreateExpenseProposal(postData, meetingId));
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
          ...register('amount', { required: 'Required' }),
          step: '0.01',
        }}
        helperText={errors.name?.message}
        error={!!errors.name}
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
          defaultValue={[]}
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
          Create
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;

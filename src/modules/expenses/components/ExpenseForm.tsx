import React from 'react';
import { Controller, FieldError, useForm } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import { expensesFormDialogMeetingIdSelector } from '../selectors';
import { expensesCreateExpenseProposal } from '../actions';
import classes from './ExpenseForm.module.scss';
import type { IExpenseCreateRequest } from '../actions';
import ExpenseFormUserList from './ExpenseFormUserList';
import { Typography } from '@material-ui/core';

const ExpenseForm: React.FC = () => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IExpenseCreateRequest>();

  const description = watch('description', '');

  const meetingId = useAppSelector(expensesFormDialogMeetingIdSelector);

  const dispatch = useAppDispatch();

  const onSubmit = (data: IExpenseCreateRequest) => {
    console.log(data);
    if (meetingId) {
      dispatch(expensesCreateExpenseProposal(data, meetingId));
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
              onPayeesSelectedChange={l => field.onChange(l)}
              error={
                !!errors.users
                  ? 'At least one participant must pay'
                  : undefined
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

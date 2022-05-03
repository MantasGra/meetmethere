import { ClassNames } from '@emotion/react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';

import {
  expensesCreateExpenseProposal,
  expensesEditExpenseProposal,
} from '../actions';
import {
  expensesEditedExpenseSelector,
  expensesFormDialogMeetingIdSelector,
  expensesIsFormEditSelector,
  expensesMeetingParticipantSelector,
} from '../selectors';

import classes from './ExpenseForm.styles';
import ExpenseFormUserList from './ExpenseFormUserList';

export interface IExpenseForm {
  name: string;
  description: string;
  amount: number;
  userIds: number[];
}

const ExpenseForm: React.FC = () => {
  // Form
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<IExpenseForm>();
  const description = watch('description', '');

  // Selectors
  const meetingId = useAppSelector(expensesFormDialogMeetingIdSelector);
  const isEditForm = useAppSelector(expensesIsFormEditSelector);
  const editedExpense = useAppSelector(expensesEditedExpenseSelector);
  const expensesMeetingParticipants = useAppSelector(
    expensesMeetingParticipantSelector,
  );

  const dispatch = useAppDispatch();

  // Derived values
  const editedExpenseUserIds = useMemo(() => {
    if (!editedExpense) {
      return [];
    }
    return editedExpense.users.map((user) => user.id);
  }, [editedExpense]);

  // Effects
  useEffect(() => {
    if (isEditForm && editedExpense) {
      reset({
        name: editedExpense.name,
        description: editedExpense.description,
        amount: editedExpense.amount,
        userIds: editedExpenseUserIds,
      });
    }
  }, [isEditForm, editedExpense, editedExpenseUserIds, reset]);

  // Event handlers
  const onSubmit = useCallback(
    (data: IExpenseForm) => {
      if (meetingId) {
        if (isEditForm && editedExpense) {
          dispatch(
            expensesEditExpenseProposal(data, meetingId, editedExpense.id),
          );
        } else {
          dispatch(expensesCreateExpenseProposal(data, meetingId));
        }
      }
    },
    [meetingId, isEditForm, editedExpense, dispatch],
  );

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
          ...register('amount', {
            validate: (value) => value > 0,
            valueAsNumber: true,
          }),
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
      <ClassNames>
        {({ css }) => (
          <TextField
            inputProps={{
              ...register('description'),
              maxLength: 500,
            }}
            helperText={`${description.length}/500`}
            FormHelperTextProps={{
              className: css`
                ${classes.helperTextRight};
              `,
            }}
            margin="dense"
            variant="outlined"
            label="Description"
            fullWidth
            multiline
            rows={4}
          />
        )}
      </ClassNames>
      <div>
        <Controller
          control={control}
          defaultValue={editedExpenseUserIds}
          name="userIds"
          rules={{
            validate: (value) => value.length !== 0,
          }}
          render={({ field }) => (
            <ExpenseFormUserList
              userOptions={expensesMeetingParticipants}
              selectedUserIds={field.value}
              onSelectedUserIdsChange={(l) => field.onChange(l)}
              error={
                errors.userIds?.length
                  ? 'At least one participant must pay'
                  : undefined
              }
            />
          )}
        />
      </div>
      <div css={classes.submitContainer}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          css={classes.submitButton}
        >
          {isEditForm ? 'Edit' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;

import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import { useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import SubmitButton from 'src/modules/formSubmitBlocker/components/SubmitButton';
import { emailRegex } from 'src/utils/regex';

import { authRequestPasswordResetProposal } from '../actions';
import { authFormErrorsSelector } from '../selectors';

import classes from './RequestPasswordResetForm.styles';

export interface IRequestPasswordResetForm {
  email: string;
}

const RequestPasswordResetForm: React.FC = () => {
  // Form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IRequestPasswordResetForm>();

  // Selectors
  const { overall } = useAppSelector(authFormErrorsSelector);

  const dispatch = useAppDispatch();

  const onSubmit = useCallback(
    (formData: IRequestPasswordResetForm) => {
      dispatch(authRequestPasswordResetProposal(formData));
    },
    [dispatch],
  );

  return (
    <form>
      {overall && <Alert severity="error">{overall}</Alert>}
      <Controller
        render={({ field }) => (
          <TextField
            {...field}
            margin="dense"
            label="Email"
            inputProps={{ maxLength: 100 }}
            helperText={errors.email?.message}
            error={!!errors.email}
            autoComplete="off"
            variant="standard"
            fullWidth
          />
        )}
        name="email"
        control={control}
        defaultValue=""
        rules={{
          required: {
            value: true,
            message: 'Required',
          },
          pattern: {
            value: emailRegex,
            message: 'That is not a valid email',
          },
        }}
      />
      <SubmitButton
        type="button"
        variant="contained"
        color="primary"
        onClick={handleSubmit(onSubmit)}
        css={classes.submitButton}
        fullWidth
      >
        Submit
      </SubmitButton>
    </form>
  );
};

export default RequestPasswordResetForm;

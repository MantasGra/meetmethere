import Alert from '@mui/material/Alert';
import { omit } from 'lodash';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, Navigate } from 'react-router';
import { Routes } from 'src/constants/enums';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import SubmitButton from 'src/modules/formSubmitBlocker/components/SubmitButton';

import {
  authResetPasswordErrorsChange,
  authResetPasswordProposal,
} from '../actions';
import { authResetPasswordErrorsSelector } from '../selectors';

import PasswordInput from './PasswordInput';
import classes from './ResetPasswordForm.styles';

export interface IResetPasswordForm {
  token: string;
  password: string;
  passwordRepeat: string;
}

const ResetPasswordForm: React.FC = () => {
  // Router
  const { hash } = useLocation();
  const navigate = useNavigate();

  // Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<IResetPasswordForm>();

  const token = watch('token', '');
  const passwordValue = watch('password', '');

  const { overall } = useAppSelector(authResetPasswordErrorsSelector);

  const dispatch = useAppDispatch();

  // Consume hash
  useEffect(() => {
    if (hash) {
      dispatch(authResetPasswordErrorsChange({}));
      reset({ token: hash.slice(1) });
      navigate('', { replace: false });
    }
  }, [hash, reset, navigate, dispatch]);

  const onSubmit = useCallback(
    (formData: IResetPasswordForm) => {
      dispatch(authResetPasswordProposal(omit(formData, 'passwordRepeat')));
    },
    [dispatch],
  );

  if (!hash && !token) {
    return <Navigate to={Routes.Home} replace />;
  }

  return (
    <form>
      {overall && <Alert severity="error">{overall}</Alert>}
      <PasswordInput
        id="password"
        label="Password"
        control={control}
        name="password"
        rules={{
          required: {
            value: true,
            message: 'Required',
          },
          minLength: {
            value: 6,
            message: 'Must be at least 6 characters long',
          },
        }}
        defaultValue=""
        error={errors.password?.message}
        autoComplete="off"
      />
      <PasswordInput
        id="passwordRepeat"
        label="Repeat Password"
        control={control}
        name="passwordRepeat"
        rules={{
          required: {
            value: true,
            message: 'Required',
          },
          validate: (value) =>
            value === passwordValue || 'The passwords do not match',
        }}
        defaultValue=""
        error={errors.passwordRepeat?.message}
        autoComplete="off"
      />
      <SubmitButton
        type="button"
        variant="contained"
        color="primary"
        onSubmit={handleSubmit(onSubmit)}
        css={classes.submitButton}
        fullWidth
        submitOnEnter
      >
        Save
      </SubmitButton>
    </form>
  );
};

export default ResetPasswordForm;

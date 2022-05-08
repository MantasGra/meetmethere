import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import SubmitButton from 'src/modules/formSubmitBlocker/components/SubmitButton';
import { emailRegex } from 'src/utils/regex';

import {
  authLoginSubmitProposal,
  authSwitchToPasswordResetProposal,
  authSwitchToRegisterProposal,
} from '../actions';
import { authFormErrorsSelector } from '../selectors';

import classes from './LoginForm.styles';

export interface ILoginForm {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ILoginForm>();

  const [showPassword, setShowPassword] = useState(false);

  const storedErrors = useAppSelector(authFormErrorsSelector);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (storedErrors.email) {
      setError('email', { type: 'server', message: storedErrors.email });
    }
    if (storedErrors.password) {
      setError('password', { type: 'server', message: storedErrors.email });
    }
  }, [storedErrors, setError]);

  const onSubmit = (data: ILoginForm) => {
    dispatch(authLoginSubmitProposal(data));
  };

  const onShowPasswordToggle = () => {
    setShowPassword((value) => !value);
  };

  const onShowPasswordMouseDown = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const onRegisterClick = () => {
    dispatch(authSwitchToRegisterProposal());
  };

  const onForgotPasswordClick = () => {
    dispatch(authSwitchToPasswordResetProposal());
  };

  return (
    <form>
      {storedErrors.overall ? (
        <Alert severity="error">{storedErrors.overall}</Alert>
      ) : null}
      <Controller
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            label="Email"
            helperText={errors.email?.message}
            error={!!errors.email}
            inputProps={{ maxLength: 100 }}
            autoComplete="username"
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
      <Controller
        render={({ field }) => (
          <FormControl error={!!errors.password} variant="standard" fullWidth>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              {...field}
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              inputProps={{ maxLength: 100 }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    id="passwordVisibilityButton"
                    onClick={onShowPasswordToggle}
                    onMouseDown={onShowPasswordMouseDown}
                    size="large"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              aria-describedby="password-error-text"
            />
            {errors.password ? (
              <FormHelperText id="password-error-text">
                {errors.password?.message}
              </FormHelperText>
            ) : null}
          </FormControl>
        )}
        name="password"
        control={control}
        defaultValue=""
        rules={{
          required: {
            value: true,
            message: 'Required',
          },
        }}
      />
      <SubmitButton
        type="button"
        variant="contained"
        color="primary"
        fullWidth
        css={classes.submitButton}
        onClick={handleSubmit(onSubmit)}
      >
        Login
      </SubmitButton>
      <Typography variant="caption" align="right" display="block">
        <Link
          component="span"
          css={classes.link}
          onClick={onForgotPasswordClick}
        >
          Forgot password?
        </Link>
      </Typography>
      <Typography variant="caption" align="right" display="block">
        Not a member?{' '}
        <Link component="span" onClick={onRegisterClick} css={classes.link}>
          Register
        </Link>
      </Typography>
    </form>
  );
};

export default LoginForm;

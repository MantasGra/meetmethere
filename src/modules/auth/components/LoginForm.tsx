import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FormHelperText from '@material-ui/core/FormHelperText';
import Alert from '@material-ui/lab/Alert';

import { emailRegex } from 'src/utils/regex';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import {
  authLoginSubmitProposal,
  authSwitchToRegisterProposal,
} from '../actions';
import { authFormErrorsSelector } from '../selectors';

import classes from './LoginForm.module.scss';

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
  }, [storedErrors]);

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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
          <FormControl fullWidth error={!!errors.password}>
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
                    onClick={onShowPasswordToggle}
                    onMouseDown={onShowPasswordMouseDown}
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
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        className={classes.submitButton}
      >
        Login
      </Button>
      <Typography variant="caption" align="right" display="block">
        Not a member?{' '}
        <Link
          component="span"
          onClick={onRegisterClick}
          className={classes.registerLink}
        >
          Register
        </Link>
      </Typography>
    </form>
  );
};

export default LoginForm;

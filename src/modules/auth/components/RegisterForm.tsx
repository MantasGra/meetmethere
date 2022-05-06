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
  authRegisterSubmitProposal,
  authSwitchToLoginProposal,
} from '../actions';
import { authFormErrorsSelector } from '../selectors';

import classes from './RegisterForm.styles';

export interface IRegisterForm {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

const RegisterForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<IRegisterForm>();

  const [showPassword, setShowPassword] = useState(false);

  const storedErrors = useAppSelector(authFormErrorsSelector);

  useEffect(() => {
    if (storedErrors.email) {
      setError('email', { type: 'server', message: storedErrors.email });
    }
    if (storedErrors.password) {
      setError('password', { type: 'server', message: storedErrors.email });
    }
  }, [storedErrors, setError]);

  const dispatch = useAppDispatch();

  const onSubmit = (data: IRegisterForm) => {
    dispatch(authRegisterSubmitProposal(data));
  };

  const onShowPasswordToggle = () => {
    setShowPassword((value) => !value);
  };

  const onShowPasswordMouseDown = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const onLoginClick = () => {
    dispatch(authSwitchToLoginProposal());
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
            margin="dense"
            label="Name"
            inputProps={{ maxLength: 100 }}
            helperText={errors.name?.message}
            error={!!errors.name}
            autoComplete="given-name"
            variant="standard"
            fullWidth
          />
        )}
        name="name"
        control={control}
        defaultValue=""
        rules={{
          required: {
            value: true,
            message: 'Required',
          },
        }}
      />
      <Controller
        render={({ field }) => (
          <TextField
            {...field}
            margin="dense"
            label="Last Name"
            helperText={errors.lastName?.message}
            inputProps={{ maxLength: 100 }}
            error={!!errors.lastName}
            autoComplete="family-name"
            variant="standard"
            fullWidth
          />
        )}
        name="lastName"
        control={control}
        defaultValue=""
        rules={{
          required: {
            value: true,
            message: 'Required',
          },
        }}
      />
      <Controller
        render={({ field }) => (
          <TextField
            {...field}
            margin="dense"
            label="Email"
            helperText={errors.email?.message}
            inputProps={{ maxLength: 100 }}
            error={!!errors.email}
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
          <FormControl
            fullWidth
            error={!!errors.password}
            variant="standard"
            margin="dense"
          >
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              {...field}
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              inputProps={{ maxLength: 100 }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
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
          minLength: {
            value: 6,
            message: 'Must be at least 6 characters long',
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
        Register
      </SubmitButton>
      <Typography variant="caption" align="right" display="block">
        Already have an account?{' '}
        <Link component="span" onClick={onLoginClick} css={classes.loginLink}>
          Login
        </Link>
      </Typography>
    </form>
  );
};

export default RegisterForm;

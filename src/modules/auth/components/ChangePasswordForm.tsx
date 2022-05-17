import { omit } from 'lodash';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';

import SubmitButton from '../../formSubmitBlocker/components/SubmitButton';
import { authChangePasswordSubmitProposal } from '../actions';
import { authChangePasswordErrorsSelector } from '../selectors';

import classes from './ChangePasswordForm.styles';
import PasswordInput from './PasswordInput';

export interface IChangePasswordForm {
  oldPassword: string;
  newPassword: string;
  newPasswordRepeat: string;
}

const ChangePasswordForm: React.FC = () => {
  // Form
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<IChangePasswordForm>();
  const newPasswordValue = watch('newPassword', '');

  // Selectors
  const { oldPassword } = useAppSelector(authChangePasswordErrorsSelector);

  // Effects
  useEffect(() => {
    if (oldPassword) {
      setError('oldPassword', { type: 'server', message: oldPassword });
    }
  }, [setError, oldPassword]);

  const dispatch = useAppDispatch();

  // Event handlers
  const onSubmit = useCallback(
    (data: IChangePasswordForm) => {
      dispatch(
        authChangePasswordSubmitProposal(omit(data, 'newPasswordRepeat')),
      );
    },
    [dispatch],
  );

  return (
    <form>
      <PasswordInput
        id="oldPassword"
        label="Password"
        control={control}
        name="oldPassword"
        defaultValue=""
        rules={{
          required: {
            value: true,
            message: 'Required',
          },
        }}
        error={errors.oldPassword?.message}
        autoComplete="off"
      />
      <PasswordInput
        id="newPassword"
        label="New Password"
        control={control}
        name="newPassword"
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
        error={errors.newPassword?.message}
        autoComplete="off"
      />
      <PasswordInput
        id="newPasswordRepeat"
        label="Repeat New Password"
        control={control}
        name="newPasswordRepeat"
        defaultValue=""
        rules={{
          required: {
            value: true,
            message: 'Required',
          },
          validate: (value) =>
            value === newPasswordValue || 'The passwords do not match',
        }}
        error={errors.newPassword?.message}
        autoComplete="off"
      />
      <SubmitButton
        type="button"
        variant="contained"
        color="primary"
        onSubmit={handleSubmit(onSubmit)}
        css={classes.submitButton}
        submitOnEnter
        fullWidth
      >
        Save
      </SubmitButton>
    </form>
  );
};

export default ChangePasswordForm;

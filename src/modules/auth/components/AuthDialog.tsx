import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useMemo } from 'react';
import CloseableDialogTitle from 'src/components/CloseableDialogTitle';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import usePreviousConditional from 'src/hooks/usePreviousConditional';

import { authLoginDialogVisibleChangeRequest } from '../actions';
import { AuthDialogType } from '../reducer';
import { isAuthDialogOpenSelector, authDialogTypeSelector } from '../selectors';

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import RequestPasswordResetForm from './RequestPasswordResetForm';

const AuthDialog: React.FC = () => {
  const open = useAppSelector(isAuthDialogOpenSelector);
  const dialogType = useAppSelector(authDialogTypeSelector);

  const titleText = useMemo(() => {
    switch (dialogType) {
      case AuthDialogType.Login:
        return 'Login';
      case AuthDialogType.Register:
        return 'Register';
      case AuthDialogType.ResetPassword:
        return 'Request password reset';
    }
  }, [dialogType]);

  const titleTextRendered = usePreviousConditional(titleText, !open);

  const Form = useMemo(() => {
    switch (dialogType) {
      case AuthDialogType.Login:
        return LoginForm;
      case AuthDialogType.Register:
        return RegisterForm;
      case AuthDialogType.ResetPassword:
        return RequestPasswordResetForm;
    }
  }, [dialogType]);

  const FormRendered = usePreviousConditional(Form, !open);

  const dispatch = useAppDispatch();

  const onDialogClose = () => {
    dispatch(authLoginDialogVisibleChangeRequest(false));
  };

  return (
    <Dialog open={open} maxWidth="xs" onClose={onDialogClose}>
      <CloseableDialogTitle onClose={onDialogClose}>
        {titleTextRendered}
      </CloseableDialogTitle>
      <DialogContent>{FormRendered && <FormRendered />}</DialogContent>
    </Dialog>
  );
};

export default AuthDialog;

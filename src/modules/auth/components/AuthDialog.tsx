import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import CloseableDialogTitle from 'src/components/CloseableDialogTitle';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import {
  isAuthDialogOpenSelector,
  isAuthDialogRegisterSelector,
} from '../selectors';
import { authLoginDialogVisibleChangeRequest } from '../actions';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthDialog: React.FC = () => {
  const open = useAppSelector(isAuthDialogOpenSelector);
  const isRegister = useAppSelector(isAuthDialogRegisterSelector);

  const dispatch = useAppDispatch();

  const onDialogClose = () => {
    dispatch(authLoginDialogVisibleChangeRequest(false));
  };

  return (
    <Dialog open={open} maxWidth="xs" onClose={onDialogClose}>
      <CloseableDialogTitle onClose={onDialogClose}>
        {isRegister ? 'Register' : 'Login'}
      </CloseableDialogTitle>
      <DialogContent>
        {isRegister ? <RegisterForm /> : <LoginForm />}
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;

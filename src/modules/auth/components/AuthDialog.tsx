import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useMemo } from 'react';
import CloseableDialogTitle from 'src/components/CloseableDialogTitle';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import usePreviousConditional from 'src/hooks/usePreviousConditional';

import { authLoginDialogVisibleChangeRequest } from '../actions';
import {
  isAuthDialogOpenSelector,
  isAuthDialogRegisterSelector,
} from '../selectors';

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthDialog: React.FC = () => {
  const open = useAppSelector(isAuthDialogOpenSelector);
  const isRegister = useAppSelector(isAuthDialogRegisterSelector);

  const titleText = useMemo(
    () => (isRegister ? 'Register' : 'Login'),
    [isRegister],
  );

  const titleTextRendered = usePreviousConditional(titleText, !open);

  const Form = useMemo(
    () => (isRegister ? RegisterForm : LoginForm),
    [isRegister],
  );

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

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseableDialogTitle from 'src/components/CloseableDialogTitle';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';

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

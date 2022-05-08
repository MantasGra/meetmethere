import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useCallback } from 'react';
import CloseableDialogTitle from 'src/components/CloseableDialogTitle';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';

import { authChangePasswordDialogVisibleChangeRequest } from '../actions';
import { isChangePasswordDialogOpenSelector } from '../selectors';

import ChangePasswordForm from './ChangePasswordForm';

const ChangePasswordDialog: React.FC = () => {
  const open = useAppSelector(isChangePasswordDialogOpenSelector);

  const dispatch = useAppDispatch();

  const onClose = useCallback(() => {
    dispatch(authChangePasswordDialogVisibleChangeRequest(false));
  }, [dispatch]);

  return (
    <Dialog open={open} maxWidth="xs" onClose={onClose}>
      <CloseableDialogTitle onClose={onClose}>
        Change password
      </CloseableDialogTitle>
      <DialogContent>
        <ChangePasswordForm />
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;

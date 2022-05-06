import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseableDialogTitle from 'src/components/CloseableDialogTitle';
import { useAppSelector, useAppDispatch } from 'src/hooks/redux';

import { meetingsCreateDialogVisibleChangeRequest } from '../actions';
import { meetingsIsCreateDialogOpenSelector } from '../selectors';

import CreateMeetingForm from './CreateMeetingForm';

const CreateMeetingDialog: React.FC = () => {
  const open = useAppSelector(meetingsIsCreateDialogOpenSelector);
  const dispatch = useAppDispatch();
  const onClose = () => {
    dispatch(meetingsCreateDialogVisibleChangeRequest(false));
  };

  return (
    <Dialog open={open} maxWidth="md">
      <CloseableDialogTitle onClose={onClose}>
        Create Meeting
      </CloseableDialogTitle>
      <DialogContent>
        <CreateMeetingForm />
      </DialogContent>
    </Dialog>
  );
};

export default CreateMeetingDialog;

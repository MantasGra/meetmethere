import React from 'react';
import AuthDialog from 'src/modules/auth/components/AuthDialog';
import CreateMeetingDialog from 'src/modules/meetings/components/CreateMeetingDialog';

const Dialogs: React.FC = () => (
  <>
    <AuthDialog />
    <CreateMeetingDialog />
  </>
);

export default Dialogs;

import React from 'react';
import AuthDialog from 'src/modules/auth/components/AuthDialog';
import CreateMeetingDialog from 'src/modules/meetings/components/CreateMeetingDialog';
import AnnouncementFormDialog from 'src/modules/announcements/components/AnnouncementFormDialog';

const Dialogs: React.FC = () => (
  <>
    <AuthDialog />
    <CreateMeetingDialog />
    <AnnouncementFormDialog />
  </>
);

export default Dialogs;

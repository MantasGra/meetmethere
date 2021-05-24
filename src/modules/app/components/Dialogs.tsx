import React from 'react';
import AuthDialog from 'src/modules/auth/components/AuthDialog';
import CreateMeetingDialog from 'src/modules/meetings/components/CreateMeetingDialog';
import AnnouncementFormDialog from 'src/modules/announcements/components/AnnouncementFormDialog';
import ActivityFormDialog from 'src/modules/activitites/components/ActivityFormDialog';

const Dialogs: React.FC = () => (
  <>
    <AuthDialog />
    <CreateMeetingDialog />
    <AnnouncementFormDialog />
    <ActivityFormDialog />
  </>
);

export default Dialogs;

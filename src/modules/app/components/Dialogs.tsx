import React from 'react';
import AuthDialog from 'src/modules/auth/components/AuthDialog';
import CreateMeetingDialog from 'src/modules/meetings/components/CreateMeetingDialog';
import AnnouncementFormDialog from 'src/modules/announcements/components/AnnouncementFormDialog';
import ActivityFormDialog from 'src/modules/activitites/components/ActivityFormDialog';
import ExpenseFormDialog from 'src/modules/expenses/components/ExpenseFormDialog';

const Dialogs: React.FC = () => (
  <>
    <AuthDialog />
    <CreateMeetingDialog />
    <AnnouncementFormDialog />
    <ActivityFormDialog />
    <ExpenseFormDialog />
  </>
);

export default Dialogs;

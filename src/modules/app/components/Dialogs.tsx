import { Fragment } from 'react';
import ActivityFormDialog from 'src/modules/activitites/components/ActivityFormDialog';
import AnnouncementFormDialog from 'src/modules/announcements/components/AnnouncementFormDialog';
import AuthDialog from 'src/modules/auth/components/AuthDialog';
import ExpenseFormDialog from 'src/modules/expenses/components/ExpenseFormDialog';
import InviteUserDialog from 'src/modules/invitations/components/InviteUserDialog';
import CancelMeetingConfirmationDialog from 'src/modules/meetings/components/CancelMeetingConfirmationDialog';
import CreateMeetingDialog from 'src/modules/meetings/components/CreateMeetingDialog';
import MeetingPollDialog from 'src/modules/meetings/components/MeetingPollDialog';

const Dialogs: React.FC = () => (
  <Fragment>
    <AuthDialog />
    <CreateMeetingDialog />
    <AnnouncementFormDialog />
    <ActivityFormDialog />
    <ExpenseFormDialog />
    <MeetingPollDialog />
    <InviteUserDialog />
    <CancelMeetingConfirmationDialog />
  </Fragment>
);

export default Dialogs;

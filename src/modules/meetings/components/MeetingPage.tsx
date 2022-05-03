import AddIcon from '@mui/icons-material/Add';
import { CircularProgress, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import NotFound from 'src/components/StatusIcons/NotFound';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import { activitiesFormDialogMeetingIdChangeRequest } from 'src/modules/activitites/actions';
import ActivityList from 'src/modules/activitites/components/ActivityList';
import { announcementsFormDialogMeetingIdChangeRequest } from 'src/modules/announcements/actions';
import { expensesFormDialogMeetingIdChangeRequest } from 'src/modules/expenses/actions';
import ExpensesList from 'src/modules/expenses/components/ExpensesList';
import { expensesTotalSelector } from 'src/modules/expenses/selectors';

import AnnouncementList from '../../announcements/components/AnnouncementList';
import { meetingsLoadMeetingProposal } from '../actions';
import { MeetingStatus, MeetingTabs as MeetingTabsEnum } from '../reducer';
import {
  meetingsMeetingLoadFailedSelector,
  meetingsActiveMeetingTabSelector,
  meetingsMeetingLoadedSelector,
  meetingsIsEditMode,
  meetingsStatusByIdSelector,
} from '../selectors';

import classes from './MeetingPage.styles';
import MeetingPageHeader from './MeetingPageHeader';
import MeetingTabs from './MeetingTabs';

const MeetingPage: React.FC = () => {
  const { id: idString } = useParams<'id'>();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const id = parseInt(idString!);
  const activeTab = useAppSelector(meetingsActiveMeetingTabSelector);
  const meetingLoaded = useAppSelector(
    (state) => !isNaN(id) && meetingsMeetingLoadedSelector(state, id),
  );
  const meetingLoadFailed = useAppSelector(meetingsMeetingLoadFailedSelector);

  const isEditMode = useAppSelector((state) => meetingsIsEditMode(state, id));

  const dispatch = useAppDispatch();

  const onAddAnnouncementClick = () => {
    dispatch(announcementsFormDialogMeetingIdChangeRequest(id));
  };

  const onAddActivityClick = () => {
    dispatch(activitiesFormDialogMeetingIdChangeRequest(id));
  };

  const onAddExpenseClick = () => {
    dispatch(expensesFormDialogMeetingIdChangeRequest(id));
  };

  useEffect(() => {
    if (!isNaN(id) && !meetingLoaded) {
      dispatch(meetingsLoadMeetingProposal(id));
    }
  }, [id, meetingLoaded, dispatch]);

  const totalExpenses = useSelector(expensesTotalSelector);

  const meetingStatus = useAppSelector((state) =>
    meetingsStatusByIdSelector(state, id),
  );

  const canAdd = ![MeetingStatus.Canceled, MeetingStatus.Ended].includes(
    meetingStatus,
  );

  return meetingLoaded ? (
    <Paper elevation={3} css={classes.meetingPageContainer}>
      <MeetingPageHeader id={id} />
      <MeetingTabs />
      <div
        css={classes.tabContainer}
        hidden={activeTab !== MeetingTabsEnum.Announcements}
      >
        <div css={classes.addButtonContainer}>
          {canAdd ? (
            <Button
              css={classes.addButton}
              startIcon={<AddIcon />}
              variant="contained"
              color="primary"
              onClick={onAddAnnouncementClick}
            >
              Add Announcement
            </Button>
          ) : null}
        </div>
        <div css={classes.tabContent}>
          <AnnouncementList />
        </div>
      </div>
      <div
        css={classes.tabContainer}
        hidden={activeTab !== MeetingTabsEnum.Activities}
      >
        <div css={classes.addButtonContainer}>
          {isEditMode ? (
            <Button
              css={classes.addButton}
              startIcon={<AddIcon />}
              variant="contained"
              color="primary"
              onClick={onAddActivityClick}
            >
              Add Activity
            </Button>
          ) : null}
        </div>
        <div css={classes.tabContent}>
          <ActivityList />
        </div>
      </div>
      <div
        css={classes.tabContainer}
        hidden={activeTab !== MeetingTabsEnum.Expenses}
      >
        <div css={classes.addButtonContainerWithContent}>
          <Typography variant="h6">
            Your expenses: {totalExpenses ? totalExpenses.toFixed(2) : 0}€
          </Typography>
          {canAdd ? (
            <Button
              css={classes.addButton}
              startIcon={<AddIcon />}
              onClick={onAddExpenseClick}
              variant="contained"
              color="primary"
            >
              Add Expense
            </Button>
          ) : null}
        </div>
        <div css={classes.tabContent}>
          <ExpensesList />
        </div>
      </div>
    </Paper>
  ) : meetingLoadFailed ? (
    <NotFound text="Meeting not found" />
  ) : (
    <div css={classes.loading}>
      <CircularProgress size={140} />
    </div>
  );
};

export default MeetingPage;

import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import Paper from '@material-ui/core/Paper';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import MeetingPageHeader from './MeetingPageHeader';
import MeetingTabs from './MeetingTabs';
import { MeetingTabs as MeetingTabsEnum } from '../reducer';
import {
  meetingsMeetingLoadFailedSelector,
  meetingsActiveMeetingTabSelector,
  meetingsMeetingLoadedSelector,
} from '../selectors';

import classes from './MeetingPage.module.scss';
import { meetingsLoadMeetingRequest } from '../actions';
import { CircularProgress } from '@material-ui/core';
import NotFound from 'src/components/NotFound';

interface IMeetingPageParams {
  id: string;
}

const MeetingPage: React.FC = () => {
  const { id: idString } = useParams<IMeetingPageParams>();
  const id = parseInt(idString);
  const activeTab = useAppSelector(meetingsActiveMeetingTabSelector);
  const meetingLoaded = useAppSelector(
    (state) => !isNaN(id) && meetingsMeetingLoadedSelector(state, id),
  );
  const meetingLoadFailed = useAppSelector(meetingsMeetingLoadFailedSelector);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isNaN(id) && !meetingLoaded) {
      dispatch(meetingsLoadMeetingRequest({ id }));
    }
  }, [id, meetingLoaded]);

  return meetingLoaded ? (
    <Paper elevation={3} className={classes.meetingPageContainer}>
      <MeetingPageHeader id={id} />
      <MeetingTabs />
      <div hidden={activeTab !== MeetingTabsEnum.Announcements}>
        Announcements
      </div>
      <div hidden={activeTab !== MeetingTabsEnum.Activities}>Activities</div>
      <div hidden={activeTab !== MeetingTabsEnum.Expenses}>Expenses</div>
    </Paper>
  ) : meetingLoadFailed ? (
    <NotFound text="Meeting not found" />
  ) : (
    <div className={classes.loading}>
      <CircularProgress size={140} />
    </div>
  );
};

export default MeetingPage;

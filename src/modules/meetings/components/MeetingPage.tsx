import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import MeetingPageHeader from './MeetingPageHeader';
import MeetingTabs from './MeetingTabs';
import { MeetingTabs as MeetingTabsEnum } from '../reducer';
import {
  meetingsMeetingLoadFailedSelector,
  meetingsActiveMeetingTabSelector,
  meetingsMeetingLoadedSelector,
} from '../selectors';
import { meetingsLoadMeetingRequest } from '../actions';
import { CircularProgress } from '@material-ui/core';
import NotFound from 'src/components/NotFound';
import AnnouncementList from '../../announcements/components/AnnouncementList';

import classes from './MeetingPage.module.scss';
import { announcementsFormDialogMeetingIdChangeRequest } from 'src/modules/announcements/actions';

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

  const onAddAnnouncementClick = () => {
    dispatch(announcementsFormDialogMeetingIdChangeRequest(id));
  };

  useEffect(() => {
    if (!isNaN(id) && !meetingLoaded) {
      dispatch(meetingsLoadMeetingRequest({ id }));
    }
  }, [id, meetingLoaded]);

  return meetingLoaded ? (
    <Paper elevation={3} className={classes.meetingPageContainer}>
      <MeetingPageHeader id={id} />
      <MeetingTabs />
      <div
        className={classes.tabContainer}
        hidden={activeTab !== MeetingTabsEnum.Announcements}
      >
        <div className={classes.addButtonContainer}>
          <Button
            className={classes.addButton}
            startIcon={<AddIcon />}
            variant="contained"
            color="primary"
            onClick={onAddAnnouncementClick}
          >
            Add Announcement
          </Button>
        </div>
        <div className={classes.announcementList}>
          <AnnouncementList />
        </div>
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

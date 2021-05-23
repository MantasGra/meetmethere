import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useAppSelector, useAppDispatch } from 'src/hooks/redux';
import { meetingsActiveMeetingTabSelector } from '../selectors';

import classes from './MeetingTabs.module.scss';
import { meetingsSwitchToTab } from '../actions';

const MeetingTabs: React.FC = () => {
  const selectedTab = useAppSelector(meetingsActiveMeetingTabSelector);

  const dispatch = useAppDispatch();

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    dispatch(meetingsSwitchToTab(newValue));
  };
  return (
    <Tabs
      className={classes.meetingTabs}
      value={selectedTab}
      onChange={handleChange}
      variant="fullWidth"
    >
      <Tab label="Announcements" />
      <Tab label="Activities" />
      <Tab label="Expenses" />
    </Tabs>
  );
};

export default MeetingTabs;

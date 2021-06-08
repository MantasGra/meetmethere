import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useAppSelector, useAppDispatch } from 'src/hooks/redux';
import { meetingsActiveMeetingTabSelector } from '../selectors';

import classes from './MeetingTabs.module.scss';
import { meetingsSwitchToTab } from '../actions';
import { useSelector } from 'react-redux';
import type { RootState } from 'src/modules/app/reducer';
import { isMobileSelector } from 'src/modules/app/selectors';
import { Announcement, EuroSymbol, LocalPizza } from '@material-ui/icons';

const MeetingTabs: React.FC = () => {
  const selectedTab = useAppSelector(meetingsActiveMeetingTabSelector);

  const dispatch = useAppDispatch();

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    dispatch(meetingsSwitchToTab(newValue));
  };

  const isMobile = useSelector(isMobileSelector);

  return (
    <Tabs
      className={classes.meetingTabs}
      value={selectedTab}
      onChange={handleChange}
      variant="fullWidth"
    >
      <Tab
        label={!isMobile && 'Announcements'}
        icon={isMobile ? <Announcement /> : ''}
      />
      <Tab
        label={!isMobile && 'Activities'}
        icon={isMobile ? <LocalPizza /> : ''}
      />
      <Tab
        label={!isMobile && 'Expenses'}
        icon={isMobile ? <EuroSymbol /> : ''}
      />
    </Tabs>
  );
};

export default MeetingTabs;

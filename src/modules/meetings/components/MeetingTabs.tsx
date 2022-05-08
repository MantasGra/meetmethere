import { Announcement, EuroSymbol, LocalPizza } from '@mui/icons-material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useSelector } from 'react-redux';
import { useAppSelector, useAppDispatch } from 'src/hooks/redux';
import { isMobileSelector } from 'src/modules/app/selectors';

import { meetingsSwitchToTab } from '../actions';
import { meetingsActiveMeetingTabSelector } from '../selectors';

import classes from './MeetingTabs.styles';

const MeetingTabs: React.FC = () => {
  const selectedTab = useAppSelector(meetingsActiveMeetingTabSelector);

  const dispatch = useAppDispatch();

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    dispatch(meetingsSwitchToTab(newValue));
  };

  const isMobile = useSelector(isMobileSelector);

  return (
    <Tabs
      css={classes.meetingTabs}
      value={selectedTab}
      onChange={handleChange}
      variant="fullWidth"
      textColor="inherit"
      indicatorColor="secondary"
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

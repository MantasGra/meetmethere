import React from 'react';
import { useAppSelector } from 'src/hooks/redux';
import { meetingsPlannedSelector } from '../selectors';
import MeetingList from './MeetingList';

const PlannedMeetingList: React.FC = () => {
  const meetings = useAppSelector(meetingsPlannedSelector);
  console.log(meetings);
  return <MeetingList meetings={meetings} />;
};

export default PlannedMeetingList;

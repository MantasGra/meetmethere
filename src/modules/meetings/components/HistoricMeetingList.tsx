import React from 'react';
import { useInfiniteScroll } from 'src/hooks/infiniteScroll';
import {
  meetingsHistoricMeetingLoadFailedSelector,
  meetingsHistoricMeetingsHasMoreSelector,
  meetingsHistoricMeetingsLoadingSelector,
  meetingsHistoricSelector,
} from '../selectors';
import { meetingsLoadMeetingsProposal } from '../actions';
import MeetingList from './MeetingList';

const HistoricMeetingList: React.FC = () => {
  const {
    loading,
    list: meetings,
    lastElementRef,
  } = useInfiniteScroll(
    meetingsHistoricMeetingsLoadingSelector,
    meetingsHistoricMeetingsHasMoreSelector,
    meetingsHistoricSelector,
    meetingsHistoricMeetingLoadFailedSelector,
    (page) => meetingsLoadMeetingsProposal(page, 'historic'),
  );
  return (
    <>
      <MeetingList
        meetings={meetings}
        lastElementRef={lastElementRef}
        loading={loading}
        typeOfMeeting={'historic'}
      />
    </>
  );
};

export default HistoricMeetingList;

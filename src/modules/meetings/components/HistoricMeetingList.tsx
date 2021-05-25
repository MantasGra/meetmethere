import React from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { useAppDispatch } from 'src/hooks/redux';
import { useInfiniteScroll } from 'src/hooks/infiniteScroll';
import {
  meetingsHistoricMeetingLoadFailedSelector,
  meetingsHistoricMeetingsHasMoreSelector,
  meetingsHistoricMeetingsLoadingSelector,
  meetingsHistoricSelector,
} from '../selectors';
import {
  meetingsCreateDialogVisibleChangeRequest,
  meetingsLoadMeetingsProposal,
} from '../actions';
import MeetingList from './MeetingList';

import classes from './HistoricMeetingList.module.scss';

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
  const dispatch = useAppDispatch();
  const onCreateMeetingClick = () => {
    dispatch(meetingsCreateDialogVisibleChangeRequest(true));
  };
  return (
    <>
      <MeetingList
        meetings={meetings}
        lastElementRef={lastElementRef}
        loading={loading}
        typeOfMeeting={'historic'}
      />
      <Fab
        color="primary"
        className={classes.addButton}
        onClick={onCreateMeetingClick}
      >
        <AddIcon />
      </Fab>
    </>
  );
};

export default HistoricMeetingList;

import React from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { useAppDispatch } from 'src/hooks/redux';
import { useInfiniteScroll } from 'src/hooks/infiniteScroll';
import {
  meetingsPlannedMeetingLoadFailedSelector,
  meetingsPlannedMeetingsHasMoreSelector,
  meetingsPlannedMeetingsLoadingSelector,
  meetingsPlannedSelector,
} from '../selectors';
import {
  meetingsCreateDialogVisibleChangeRequest,
  meetingsLoadMeetingsProposal,
} from '../actions';
import MeetingList from './MeetingList';

import classes from './PlannedMeetingList.module.scss';

const PlannedMeetingList: React.FC = () => {
  const { loading, list: meetings, lastElementRef } = useInfiniteScroll(
    meetingsPlannedMeetingsLoadingSelector,
    meetingsPlannedMeetingsHasMoreSelector,
    meetingsPlannedSelector,
    meetingsPlannedMeetingLoadFailedSelector,
    meetingsLoadMeetingsProposal,
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

export default PlannedMeetingList;

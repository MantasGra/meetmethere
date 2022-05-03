import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import { Fragment } from 'react';
import { useAppDispatch } from 'src/hooks/redux';

import { meetingsCreateDialogVisibleChangeRequest } from '../actions';
import { MeetingTypes } from '../reducer';

import MeetingList from './MeetingList';
import classes from './PlannedMeetingList.styles';

const PlannedMeetingList: React.FC = () => {
  const dispatch = useAppDispatch();
  const onCreateMeetingClick = () => {
    dispatch(meetingsCreateDialogVisibleChangeRequest(true));
  };

  return (
    <Fragment>
      <MeetingList typeOfMeeting={MeetingTypes.Planned} />
      <Fab
        color="primary"
        css={classes.addButton}
        onClick={onCreateMeetingClick}
      >
        <AddIcon />
      </Fab>
    </Fragment>
  );
};

export default PlannedMeetingList;

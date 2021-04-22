import React, { useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import EventIcon from '@material-ui/icons/Event';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import type { IMeeting } from '../reducer';
import NoContent from 'src/components/NoContent';
import { useAppDispatch } from 'src/hooks/redux';
import {
  meetingsCreateDialogVisibleChangeRequest,
  meetingsLoadMeetingsProposal,
} from '../actions';

import classes from './MeetingList.module.scss';

interface IProps {
  meetings: IMeeting[];
}

const MeetingList: React.FC<IProps> = ({ meetings }) => {
  const dispatch = useAppDispatch();

  const loadMeetings = () => {
    dispatch(meetingsLoadMeetingsProposal());
  };

  const onCreateMeetingClick = () => {
    dispatch(meetingsCreateDialogVisibleChangeRequest(true));
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  return (
    <>
      <div className={classes.meetingList}>
        {meetings.length ? (
          meetings.map((meeting) => (
            <Card key={meeting.id} className={classes.meetingListItem} raised>
              <CardHeader
                avatar={<EventIcon />}
                title={meeting.name}
                subheader={new Date(meeting.startDate).toLocaleString()}
                action={
                  <IconButton>
                    <MoreHorizIcon />
                  </IconButton>
                }
              />
              <CardContent>{meeting.description}</CardContent>
            </Card>
          ))
        ) : (
          <NoContent text="You have no palnned meetings!" />
        )}
      </div>
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

export default MeetingList;

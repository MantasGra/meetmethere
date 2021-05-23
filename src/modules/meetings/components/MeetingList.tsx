import React from 'react';
import { generatePath, useHistory } from 'react-router';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import EventIcon from '@material-ui/icons/Event';
import type { IMeeting } from '../reducer';
import NoContent from 'src/components/NoContent';
import MeetingStatusChip from './MeetingStatusChip';

import classes from './MeetingList.module.scss';
import AccountAvatar from 'src/modules/auth/components/AccountAvatar';
import { Routes } from 'src/constants/enums';

interface IProps {
  meetings: IMeeting[];
  loading?: boolean;
  error?: string;
  lastElementRef?: (node: Element) => void;
}

const MeetingList: React.FC<IProps> = ({
  meetings,
  lastElementRef,
  loading,
}) => {
  const history = useHistory();
  const openMeetingPage = (id: string) => {
    history.push(generatePath(Routes.MeetingPage, { id }));
  };

  return (
    <>
      <div className={classes.meetingList}>
        {meetings.length || loading ? (
          <>
            {meetings.map((meeting, index) => (
              <Card
                key={meeting.id}
                className={classes.meetingListItem}
                raised
                ref={meetings.length - 1 === index ? lastElementRef : undefined}
                onClick={() => openMeetingPage(meeting.id.toString())}
              >
                <CardHeader
                  avatar={<EventIcon />}
                  title={meeting.name}
                  titleTypographyProps={{ variant: 'h5' }}
                  subheader={
                    meeting.isDatesPollActive
                      ? 'Date poll is active'
                      : new Date(meeting.startDate).toLocaleString()
                  }
                  action={
                    <>
                      <MeetingStatusChip meetingStatus={meeting.status} />
                      <IconButton>
                        <MoreHorizIcon />
                      </IconButton>
                    </>
                  }
                />
                <CardContent className={classes.meetingListItemContent}>
                  <div className={classes.description}>
                    {meeting.description}
                  </div>
                  <div className={classes.meetingListItemAvatars}>
                    {meeting.participants.map((participant) => (
                      <AccountAvatar
                        key={participant.id}
                        initials={`${participant.name.charAt(
                          0,
                        )}${participant.lastName.charAt(0)}`}
                        color={participant.color}
                        className={classes.listItemAvatar}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            {loading && (
              <div className={classes.loading}>
                <CircularProgress size={140} />
              </div>
            )}
          </>
        ) : (
          <NoContent text="You have no planned meetings!" />
        )}
      </div>
    </>
  );
};

export default MeetingList;

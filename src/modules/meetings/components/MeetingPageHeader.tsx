import React from 'react';
import format from 'date-fns/format';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MeetingStatusChip from './MeetingStatusChip';
import getDirectionsURL from 'src/utils/getDirectionsURL';
import openInNewTab from 'src/utils/openInNewTab';
import { useAppSelector } from 'src/hooks/redux';
import { meetingsMeetingByIdSelector } from '../selectors';

import classes from './MeetingPageHeader.module.scss';
import AccountAvatar from 'src/modules/auth/components/AccountAvatar';

interface IProps {
  id: number;
}

const MeetingPageHeader: React.FC<IProps> = (props) => {
  const meeting = useAppSelector((state) =>
    meetingsMeetingByIdSelector(state, props.id),
  );

  const onGetDirectionsClick = () => {
    if (meeting.locationString) {
      openInNewTab(
        getDirectionsURL(meeting.locationString, meeting.locationId),
      );
    }
  };

  return (
    <div className={classes.meetingPageHeader}>
      <div className={classes.meetingTitleRow}>
        <Typography variant="h4" className={classes.meetingTitleText}>
          {meeting.name}
        </Typography>
        <MeetingStatusChip meetingStatus={meeting.status} />
      </div>
      <div>
        <Typography variant="body2" color="textSecondary">
          {meeting.description}
        </Typography>
      </div>
      <div className={classes.meetingInfoRow}>
        <div>
          <div className={classes.meetingDateEntry}>
            <Typography variant="subtitle2">From:</Typography>
            <Typography variant="subtitle2">
              {format(new Date(meeting.startDate), 'yyyy-MM-dd HH:mm')}
            </Typography>
          </div>
          <div className={classes.meetingDateEntry}>
            <Typography variant="subtitle2">To:</Typography>
            <Typography variant="subtitle2">
              {format(new Date(meeting.endDate), 'yyyy-MM-dd HH:mm')}
            </Typography>
          </div>
        </div>
        <div className={classes.meetingLocation}>
          <Typography
            className={classes.meetingLocationText}
            variant="subtitle2"
          >{`Location: ${meeting.locationString}`}</Typography>
          <Button onClick={onGetDirectionsClick} size="small" color="primary">
            Get Directions
          </Button>
        </div>
      </div>
      <div className={classes.meetingMemberList}>
        <Typography variant="subtitle2">Members:</Typography>
        {meeting.participants.map((participant) => (
          <AccountAvatar
            key={participant.id}
            initials={`${participant.name.charAt(
              0,
            )}${participant.lastName.charAt(0)}`}
            color={participant.color}
            className={classes.memberListAvatar}
          />
        ))}
      </div>
    </div>
  );
};

export default MeetingPageHeader;

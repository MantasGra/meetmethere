import EventIcon from '@mui/icons-material/Event';
import AvatarGroup from '@mui/material/AvatarGroup';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CircularProgress from '@mui/material/CircularProgress';
import { Fragment, useCallback, useMemo } from 'react';
import { generatePath, useNavigate, useLocation } from 'react-router-dom';
import NoContent from 'src/components/StatusIcons/NoContent';
import { Routes } from 'src/constants/enums';
import { useInfiniteScroll } from 'src/hooks/infiniteScroll';
import { RootState } from 'src/modules/app/reducer';
import AccountAvatar from 'src/modules/auth/components/AccountAvatar';
import { toDate } from 'src/utils/transformators';

import { meetingsLoadMeetingsProposal } from '../actions';
import { MeetingTypes } from '../reducer';
import {
  meetingsListHasMoreSelector,
  meetingsListLoadFailedSelector,
  meetingsListLoadingSelector,
  meetingsListSelector,
} from '../selectors';

import classes from './MeetingList.styles';
import MeetingStatusChip from './MeetingStatusChip';

interface IProps {
  typeOfMeeting: MeetingTypes;
}

const MeetingList: React.FC<IProps> = ({ typeOfMeeting }) => {
  // Router
  const navigate = useNavigate();
  const location = useLocation();
  const openMeetingPage = (id: string) => {
    navigate(generatePath(Routes.MeetingPage, { id }));
  };

  // Scroll callbacks
  const isLoadingSelector = useCallback(
    (state: RootState) => meetingsListLoadingSelector(state, typeOfMeeting),
    [typeOfMeeting],
  );
  const hasMoreSelector = useCallback(
    (state: RootState) => meetingsListHasMoreSelector(state, typeOfMeeting),
    [typeOfMeeting],
  );
  const meetingsSelector = useCallback(
    (state: RootState) => meetingsListSelector(state, typeOfMeeting),
    [typeOfMeeting],
  );
  const loadFailedSelector = useCallback(
    (state: RootState) => meetingsListLoadFailedSelector(state, typeOfMeeting),
    [typeOfMeeting],
  );
  const loadProposal = useCallback(
    (page: number) => meetingsLoadMeetingsProposal(page, typeOfMeeting),
    [typeOfMeeting],
  );

  // List
  const {
    loading,
    list: meetings,
    lastElementRef,
  } = useInfiniteScroll(
    isLoadingSelector,
    hasMoreSelector,
    meetingsSelector,
    loadFailedSelector,
    loadProposal,
  );

  // Derived values
  const typeOfMeetingClass = useMemo(
    () =>
      typeOfMeeting == MeetingTypes.Planned
        ? classes.meetingListItem
        : classes.meetingListItemHistorical,
    [typeOfMeeting],
  );

  return (
    <div css={classes.meetingList}>
      {meetings.length || loading ? (
        <Fragment>
          {meetings.map((meeting, index) => (
            <Card
              key={meeting.id}
              css={typeOfMeetingClass}
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
                    : toDate(meeting.startDate).toLocaleString()
                }
                action={<MeetingStatusChip meetingStatus={meeting.status} />}
              />
              <CardContent css={classes.meetingListItemContent}>
                <div css={classes.description}>{meeting.description}</div>
                <AvatarGroup max={4}>
                  {meeting.participants.map((participant) => (
                    <AccountAvatar
                      key={participant.id}
                      initials={`${participant.name.charAt(
                        0,
                      )}${participant.lastName.charAt(0)}`}
                      color={participant.color}
                    />
                  ))}
                </AvatarGroup>
              </CardContent>
            </Card>
          ))}
          {loading && (
            <div css={classes.loading}>
              <CircularProgress size={140} />
            </div>
          )}
        </Fragment>
      ) : (
        <div css={classes.noContentContainer}>
          <NoContent
            text={`You have no ${
              location.pathname === '/history'
                ? 'meeting history'
                : 'planned meetings'
            }!`}
          />
        </div>
      )}
    </div>
  );
};

export default MeetingList;

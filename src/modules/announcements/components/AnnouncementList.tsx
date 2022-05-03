import MoreVertIcon from '@mui/icons-material/MoreVert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import format from 'date-fns/format';
import { useState, useCallback } from 'react';
import { useParams } from 'react-router';
import NoContent from 'src/components/StatusIcons/NoContent';
import { useInfiniteScroll } from 'src/hooks/infiniteScroll';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import AccountAvatar from 'src/modules/auth/components/AccountAvatar';
import { authCurrentUserIdSelector } from 'src/modules/auth/selectors';
import { MeetingStatus } from 'src/modules/meetings/reducer';
import {
  meetingsIsUserCreator,
  meetingsStatusByIdSelector,
} from 'src/modules/meetings/selectors';

import {
  announcementsDeleteAnnouncementProposal,
  announcementsEditAnnouncementIdChange,
  announcementsLoadAnnouncementsProposal,
} from '../actions';
import {
  announcementsHasMoreSelector,
  announcementsListSelector,
  announcementsLoadFailedSelector,
  announcementsLoadingSelector,
} from '../selectors';

import classes from './AnnouncementList.styles';

interface IActiveMenuState {
  anchorEl: HTMLElement;
  announcementId: number;
  announcementCreatorId: number;
}

const AnnouncementList: React.FC = () => {
  const { id: idString } = useParams<'id'>();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const id = parseInt(idString!);
  const loadAnnouncementsProposal = useCallback(
    (page: number) => announcementsLoadAnnouncementsProposal(id, page),
    [id],
  );
  const {
    loading,
    list: announcements,
    lastElementRef,
  } = useInfiniteScroll(
    announcementsLoadingSelector,
    announcementsHasMoreSelector,
    announcementsListSelector,
    announcementsLoadFailedSelector,
    loadAnnouncementsProposal,
  );

  const [activeMenu, setActiveMenu] = useState<IActiveMenuState | null>(null);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    announcementId: number,
    announcementCreatorId: number,
  ) => {
    setActiveMenu({
      anchorEl: event.currentTarget,
      announcementId,
      announcementCreatorId,
    });
  };

  const handleMenuClose = () => {
    setActiveMenu(null);
  };

  const dispatch = useAppDispatch();

  const isUserMeetingCreator = useAppSelector((state) =>
    meetingsIsUserCreator(state, id),
  );

  const currentUserId = useAppSelector(authCurrentUserIdSelector);

  const handleEditClick = () => {
    if (activeMenu) {
      dispatch(
        announcementsEditAnnouncementIdChange(id, activeMenu.announcementId),
      );
      handleMenuClose();
    }
  };

  const handleDeleteClick = () => {
    if (activeMenu) {
      dispatch(
        announcementsDeleteAnnouncementProposal(id, activeMenu.announcementId),
      );
      handleMenuClose();
    }
  };

  const meetingStatus = useAppSelector((state) =>
    meetingsStatusByIdSelector(state, id),
  );

  return announcements.length || loading ? (
    <div css={classes.announcementList}>
      {announcements.map((announcement, index) => (
        <Card
          key={announcement.id}
          css={classes.announcementListItem}
          raised
          ref={announcements.length - 1 === index ? lastElementRef : undefined}
        >
          <CardHeader
            avatar={
              <AccountAvatar
                initials={`${announcement.user.name.charAt(
                  0,
                )}${announcement.user.lastName.charAt(0)}`}
                color={announcement.user.color}
              />
            }
            title={announcement.title}
            subheader={format(
              new Date(announcement.createDate),
              'yyyy-MM-dd HH:mm',
            )}
            action={
              (isUserMeetingCreator ||
                currentUserId === announcement.user.id) &&
              ![MeetingStatus.Canceled, MeetingStatus.Ended].includes(
                meetingStatus,
              ) ? (
                <IconButton
                  onClick={(event) =>
                    handleMenuClick(
                      event,
                      announcement.id,
                      announcement.user.id,
                    )
                  }
                  size="large"
                >
                  <MoreVertIcon />
                </IconButton>
              ) : null
            }
          />
          <CardContent>
            <Typography variant="body2">{announcement.description}</Typography>
          </CardContent>
        </Card>
      ))}
      <Menu
        anchorEl={activeMenu?.anchorEl}
        open={!!activeMenu}
        keepMounted
        onClose={handleMenuClose}
      >
        {activeMenu?.announcementCreatorId === currentUserId ? (
          <MenuItem onClick={handleEditClick}>Edit</MenuItem>
        ) : null}
        <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
      </Menu>
    </div>
  ) : (
    <NoContent text="This meeting has no announcements yet!" />
  );
};

export default AnnouncementList;

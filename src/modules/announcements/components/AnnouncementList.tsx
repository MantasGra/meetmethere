import React, { useState } from 'react';
import { useParams } from 'react-router';
import format from 'date-fns/format';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import NoContent from 'src/components/NoContent';
import { useInfiniteScroll } from 'src/hooks/infiniteScroll';
import {
  announcementsHasMoreSelector,
  announcementsListSelector,
  announcementsLoadFailedSelector,
  announcementsLoadingSelector,
} from '../selectors';
import {
  announcementsDeleteAnnouncementProposal,
  announcementsEditAnnouncementIdChange,
  announcementsLoadAnnouncementsProposal,
} from '../actions';
import AccountAvatar from 'src/modules/auth/components/AccountAvatar';
import classes from './AnnouncementList.module.scss';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import {
  meetingsIsUserCreator,
  meetingsStatusByIdSelector,
} from 'src/modules/meetings/selectors';
import { authCurrentUserIdSelector } from 'src/modules/auth/selectors';
import { MeetingStatus } from 'src/modules/meetings/reducer';

interface IMeetingPageParams {
  id: string;
}

interface IActiveMenuState {
  anchorEl: HTMLElement;
  announcementId: number;
  announcementCreatorId: number;
}

const AnnouncementList: React.FC = () => {
  const { id: idString } = useParams<IMeetingPageParams>();
  const id = parseInt(idString);
  const {
    loading,
    list: announcements,
    lastElementRef,
  } = useInfiniteScroll(
    announcementsLoadingSelector,
    announcementsHasMoreSelector,
    announcementsListSelector,
    announcementsLoadFailedSelector,
    (page) => announcementsLoadAnnouncementsProposal(id, page),
  );

  const [activeMenu, setActiveMenu] = useState<IActiveMenuState | null>(null);

  const handleClick = (
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

  const handleClose = () => {
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
      setActiveMenu(null);
    }
  };

  const handleDeleteClick = () => {
    if (activeMenu) {
      dispatch(
        announcementsDeleteAnnouncementProposal(id, activeMenu.announcementId),
      );
      setActiveMenu(null);
    }
  };

  const meetingStatus = useAppSelector((state) =>
    meetingsStatusByIdSelector(state, id),
  );

  return announcements.length || loading ? (
    <div className={classes.announcementList}>
      {announcements.map((announcement, index) => (
        <Card
          key={announcement.id}
          className={classes.announcementListItem}
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
                    handleClick(event, announcement.id, announcement.user.id)
                  }
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
        onClose={handleClose}
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

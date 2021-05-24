import React from 'react';
import { useParams } from 'react-router';
import format from 'date-fns/format';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import NoContent from 'src/components/NoContent';
import { useInfiniteScroll } from 'src/hooks/infiniteScroll';
import {
  announcementsHasMoreSelector,
  announcementsListSelector,
  announcementsLoadFailedSelector,
  announcementsLoadingSelector,
} from '../selectors';
import { announcementsLoadAnnouncementsProposal } from '../actions';
import AccountAvatar from 'src/modules/auth/components/AccountAvatar';
import classes from './AnnouncementList.module.scss';

interface IMeetingPageParams {
  id: string;
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
          />
          <CardContent>
            <Typography variant="body2" component="p">
              {announcement.description}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  ) : (
    <NoContent text="This meeting has no announcements yet!" />
  );
};

export default AnnouncementList;

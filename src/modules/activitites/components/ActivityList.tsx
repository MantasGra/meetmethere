import React, { useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import format from 'date-fns/format';
import NoContent from 'src/components/NoContent';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import {
  activitiesListSelector,
  activitiesLoadingSelector,
} from '../selectors';
import { useParams } from 'react-router';
import { activitiesLoadActivitiesProposal } from '../actions';
import { CircularProgress } from '@material-ui/core';
import classes from './ActivityList.module.scss';

interface IMeetingPageParams {
  id: string;
}

const ActivityList: React.FC = () => {
  const activities = useAppSelector(activitiesListSelector);
  const loading = useAppSelector(activitiesLoadingSelector);

  const { id: idString } = useParams<IMeetingPageParams>();

  const id = parseInt(idString);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      dispatch(activitiesLoadActivitiesProposal(id));
    }
  }, []);

  return loading ? (
    <CircularProgress />
  ) : activities.length ? (
    <List className={classes.activityList}>
      {activities.map((activity) => (
        <React.Fragment key={activity.id}>
          <ListItem divider className={classes.activityListItem}>
            <ListItemText
              className={classes.activityListItemText}
              primary={activity.name}
              secondary={activity.description}
            />
            <ListItemText
              className={classes.activityListItemDates}
              primary={`${format(
                new Date(activity.startTime),
                'yyyy-MM-dd HH:mm',
              )} - ${format(new Date(activity.endTime), 'yyyy-MM-dd HH:mm')}`}
            />
          </ListItem>
        </React.Fragment>
      ))}
    </List>
  ) : (
    <NoContent text="No activities planned" />
  );
};

export default ActivityList;

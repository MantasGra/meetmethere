import React, { useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import format from 'date-fns/format';
import NoContent from 'src/components/NoContent';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import {
  activitiesListSelector,
  activitiesLoadingSelector,
} from '../selectors';
import { useParams } from 'react-router';
import {
  activitiesDeleteActivityProposal,
  activitiesEditActivityIdChange,
  activitiesLoadActivitiesProposal,
} from '../actions';
import { CircularProgress } from '@material-ui/core';
import classes from './ActivityList.module.scss';
import { meetingsIsEditMode } from 'src/modules/meetings/selectors';

interface IMeetingPageParams {
  id: string;
}

const ActivityList: React.FC = () => {
  const activities = useAppSelector(activitiesListSelector);
  const loading = useAppSelector(activitiesLoadingSelector);

  const { id: idString } = useParams<IMeetingPageParams>();

  const id = parseInt(idString);

  const isEditMode = useAppSelector((state) => meetingsIsEditMode(state, id));

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      dispatch(activitiesLoadActivitiesProposal(id));
    }
  }, []);

  const onDeleteClick = (activityId: number) => {
    dispatch(activitiesDeleteActivityProposal(id, activityId));
  };

  const onEditClick = (activityId: number) => {
    dispatch(activitiesEditActivityIdChange(id, activityId));
  };

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
            {isEditMode && (
              <ListItemSecondaryAction>
                <IconButton>
                  <EditIcon onClick={() => onEditClick(activity.id)} />
                </IconButton>
                <IconButton>
                  <DeleteIcon onClick={() => onDeleteClick(activity.id)} />
                </IconButton>
              </ListItemSecondaryAction>
            )}
          </ListItem>
        </React.Fragment>
      ))}
    </List>
  ) : (
    <NoContent text="No activities planned" />
  );
};

export default ActivityList;

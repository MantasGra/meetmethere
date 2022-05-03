import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { CircularProgress } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import format from 'date-fns/format';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import NoContent from 'src/components/StatusIcons/NoContent';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import { meetingsIsEditMode } from 'src/modules/meetings/selectors';

import {
  activitiesDeleteActivityProposal,
  activitiesEditActivityIdChange,
  activitiesLoadActivitiesProposal,
} from '../actions';
import {
  activitiesListSelector,
  activitiesLoadingSelector,
} from '../selectors';

import classes from './ActivityList.styles';

const ActivityList: React.FC = () => {
  const activities = useAppSelector(activitiesListSelector);
  const loading = useAppSelector(activitiesLoadingSelector);

  const { id: idString } = useParams<'id'>();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const id = parseInt(idString!);

  const isEditMode = useAppSelector((state) => meetingsIsEditMode(state, id));

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      dispatch(activitiesLoadActivitiesProposal(id));
    }
  }, [dispatch, id]);

  const onDeleteClick = (activityId: number) => {
    dispatch(activitiesDeleteActivityProposal(id, activityId));
  };

  const onEditClick = (activityId: number) => {
    dispatch(activitiesEditActivityIdChange(id, activityId));
  };

  return loading ? (
    <CircularProgress />
  ) : activities.length ? (
    <List css={classes.activityList}>
      {activities.map((activity) => (
        <ListItem divider css={classes.activityListItem} key={activity.id}>
          <ListItemText
            css={classes.activityListItemText}
            primary={activity.name}
            secondary={activity.description}
          />
          <ListItemText
            css={classes.activityListItemDates}
            primary={`${format(
              new Date(activity.startTime),
              'yyyy-MM-dd HH:mm',
            )} - ${format(new Date(activity.endTime), 'yyyy-MM-dd HH:mm')}`}
          />
          {isEditMode && (
            <ListItemSecondaryAction>
              <IconButton size="large">
                <EditIcon onClick={() => onEditClick(activity.id)} />
              </IconButton>
              <IconButton size="large">
                <DeleteIcon onClick={() => onDeleteClick(activity.id)} />
              </IconButton>
            </ListItemSecondaryAction>
          )}
        </ListItem>
      ))}
    </List>
  ) : (
    <NoContent text="No activities planned" />
  );
};

export default ActivityList;

import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import type { IUserInvitation } from 'src/modules/auth/reducer';
import AccountAvatar from 'src/modules/auth/components/AccountAvatar';
import classes from './UsersList.module.scss';

interface IUsersListProps {
  users: IUserInvitation[];
}

const UsersList: React.FC<IUsersListProps> = (props) => (
  <List className={classes.userList}>
    {props.users.map((user) => (
      <ListItem key={user.id}>
        <ListItemAvatar>
          <AccountAvatar
            initials={`${user.name.charAt(0)}${user.lastName.charAt(0)}`}
            color={user.color}
          />
        </ListItemAvatar>
        <ListItemText
          primary={`${user.name} ${user.lastName}`}
          primaryTypographyProps={{ className: classes.userListName }}
        />
        <ListItemSecondaryAction>
          {`${user.userParticipationStatus
            .charAt(0)
            .toUpperCase()}${user.userParticipationStatus.substring(1)}`}
        </ListItemSecondaryAction>
      </ListItem>
    ))}
  </List>
);

export default UsersList;

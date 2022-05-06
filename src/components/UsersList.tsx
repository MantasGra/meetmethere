import { ClassNames } from '@emotion/react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import AccountAvatar from 'src/modules/auth/components/AccountAvatar';
import type { IParticipant } from 'src/modules/auth/reducer';

import classes from './UsersList.styles';

interface IUsersListProps {
  users: IParticipant[];
}

const UsersList: React.FC<IUsersListProps> = (props) => (
  <List css={classes.userList}>
    {props.users.map((user) => (
      <ListItem key={user.id}>
        <ListItemAvatar>
          <AccountAvatar
            initials={`${user.name.charAt(0)}${user.lastName.charAt(0)}`}
            color={user.color}
          />
        </ListItemAvatar>
        <ClassNames>
          {({ css }) => (
            <ListItemText
              primary={`${user.name} ${user.lastName}`}
              primaryTypographyProps={{
                className: css`
                  ${classes.userListName};
                `,
              }}
            />
          )}
        </ClassNames>
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

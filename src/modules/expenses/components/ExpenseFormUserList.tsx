import {
  Checkbox,
  FormControl,
  FormGroup,
  FormLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import React from 'react';
import { useAppSelector } from 'src/hooks/redux';
import type { IUser } from 'src/modules/auth/reducer';
import { expensesMeetingParticipantSelector } from '../selectors';
import FormHelperText from '@material-ui/core/FormHelperText';
import classes from './ExpensesList.module.scss';

export interface ExpenseFormUserListParams {
  payeesList: IUser[];
  onPayeesSelectedChange(users: IUser[]): void;
  error?: string;
}

const ExpenseFormUserList: React.FC<ExpenseFormUserListParams> = ({
  payeesList,
  onPayeesSelectedChange,
  error,
}: ExpenseFormUserListParams) => {
  const meetingParticipantList = useAppSelector(
    expensesMeetingParticipantSelector,
  );

  const handleToggle = (user: IUser) => () => {
    const currentIndex = payeesList.indexOf(user);
    const newChecked = [...payeesList];

    if (currentIndex === -1) {
      newChecked.push(user);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    onPayeesSelectedChange(newChecked);
  };
  return (
    <FormControl error={!!error} required component="fieldset">
      <FormLabel component="legend">Select payees</FormLabel>
      <FormGroup>
        <List className={classes.listRoot}>
          {meetingParticipantList !== null &&
            meetingParticipantList.map((user) => {
              const labelId = `checkbox-user-label-${user.id}`;
              return (
                <ListItem
                  key={user.id}
                  role={undefined}
                  dense
                  button
                  onClick={handleToggle(user)}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={payeesList.indexOf(user) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={user.name} />
                </ListItem>
              );
            })}
        </List>
      </FormGroup>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default ExpenseFormUserList;

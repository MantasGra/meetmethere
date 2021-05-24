import {
  Checkbox,
  Divider,
  FormControl,
  FormGroup,
  FormLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import FormHelperText from '@material-ui/core/FormHelperText';
import React from 'react';
import { useAppSelector } from 'src/hooks/redux';
import type { IUser } from 'src/modules/auth/reducer';
import { expensesMeetingParticipantSelector } from '../selectors';
import classes from './ExpensesList.module.scss';

export interface ExpenseFormUserListParams {
  payeesList: IUser[];
  onPayeesSelectedChange(users: IUser[]): void;
  error?: string;
}

enum SelectionType {
  Full,
  Partial,
  Empty,
}

const ExpenseFormUserList: React.FC<ExpenseFormUserListParams> = ({
  payeesList,
  onPayeesSelectedChange,
  error,
}: ExpenseFormUserListParams) => {
  const meetingParticipantList = useAppSelector(
    expensesMeetingParticipantSelector,
  );
  const payeeIds = payeesList.map((p) => p.id);
  const handleToggle = (user: IUser) => () => {
    const currentIndex = payeeIds.indexOf(user.id);
    const newChecked = [...payeesList];

    if (currentIndex === -1) {
      newChecked.push(user);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    onPayeesSelectedChange(newChecked);
  };

  const getSelectionType = () => {
    if (payeeIds.length === 0) {
      return SelectionType.Empty;
    } else if (payeeIds.length === meetingParticipantList?.length) {
      return SelectionType.Full;
    } else {
      return SelectionType.Partial;
    }
  };

  const selectAllToggle = () => {
    if (getSelectionType() === SelectionType.Empty) {
      onPayeesSelectedChange(
        meetingParticipantList === null ? [] : meetingParticipantList,
      );
    } else {
      onPayeesSelectedChange([]);
    }
  };

  return (
    <FormControl error={!!error} required component="fieldset">
      <FormLabel component="legend">Select payees</FormLabel>
      <FormGroup>
        <ListItem
          key="checkAll"
          role={undefined}
          dense
          button
          onClick={selectAllToggle}
        >
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={getSelectionType() === SelectionType.Full}
              tabIndex={-1}
              indeterminate={getSelectionType() === SelectionType.Partial}
              disableRipple
            />
          </ListItemIcon>
          <ListItemText primary="Select all" />
        </ListItem>
        <Divider />
        <List className={classes.listRoot}>
          {meetingParticipantList !== null &&
            meetingParticipantList.map((user) => {
              const labelId = `checkbox-user-label-${user.id}`;
              const isSelected = payeeIds.indexOf(user.id) >= 0;
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
                      checked={isSelected}
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

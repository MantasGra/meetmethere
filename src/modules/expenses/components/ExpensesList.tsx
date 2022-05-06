import { MoreVert } from '@mui/icons-material';
import { IconButton, Menu, MenuItem } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { useState, useCallback, useEffect, Fragment } from 'react';
import { useParams } from 'react-router';
import NoContent from 'src/components/StatusIcons/NoContent';
import AccountAvatar from 'src/modules/auth/components/AccountAvatar';
import {
  authCurrentUserIdSelector,
  getUserInitials,
} from 'src/modules/auth/selectors';
import { MeetingStatus } from 'src/modules/meetings/reducer';
import {
  meetingsIsUserCreator,
  meetingsStatusByIdSelector,
} from 'src/modules/meetings/selectors';

import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
  expensesDeleteExpenseProposal,
  expensesEditExpenseIdChange,
  expensesLoadExpensesProposal,
} from '../actions';
import type { IExpense } from '../reducer';
import { expensesListSelector, expensesLoadingSelector } from '../selectors';

import classes from './ExpensesList.styles';

// TODO: Factor out list item component for improved memoization

interface IActiveMenuState {
  anchorEl: HTMLElement;
  expenseId: number;
  expenseCreatorId: number;
}

const getExpenseAmountString = (expense: IExpense) => {
  const amount = expense.amount || 0;
  return `${amount.toFixed(2)}€ (${(
    expense.amount / expense.users.length
  ).toFixed(2)}€ each)`;
};

const ExpensesList: React.FC = () => {
  // Route params
  const { id: idString } = useParams<'id'>();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const id = parseInt(idString!);

  // Selectors
  const expenses = useAppSelector(expensesListSelector);
  const loading = useAppSelector(expensesLoadingSelector);
  const isUserMeetingCreator = useAppSelector((state) =>
    meetingsIsUserCreator(state, id),
  );
  const currentUserId = useAppSelector(authCurrentUserIdSelector);
  const meetingStatus = useAppSelector((state) =>
    meetingsStatusByIdSelector(state, id),
  );

  const dispatch = useAppDispatch();

  // Helpers
  const shouldShowMenuButton = useCallback(
    (expense: IExpense) =>
      (isUserMeetingCreator || currentUserId === expense.createdBy.id) &&
      ![MeetingStatus.Canceled, MeetingStatus.Ended].includes(meetingStatus),
    [isUserMeetingCreator, currentUserId, meetingStatus],
  );

  // State
  const [activeMenu, setActiveMenu] = useState<IActiveMenuState | null>(null);

  // Effects
  useEffect(() => {
    if (id) {
      dispatch(expensesLoadExpensesProposal(id));
    }
  }, [dispatch, id]);

  // Event handlers
  const handleMenuClick = useCallback(
    (
      event: React.MouseEvent<HTMLElement>,
      expenseId: number,
      expenseCreatorId: number,
    ) => {
      setActiveMenu({
        anchorEl: event.currentTarget,
        expenseId,
        expenseCreatorId,
      });
    },
    [],
  );

  const handleMenuClose = useCallback(() => {
    setActiveMenu(null);
  }, []);

  const handleEditClick = useCallback(() => {
    if (activeMenu) {
      dispatch(expensesEditExpenseIdChange(id, activeMenu.expenseId));
      handleMenuClose();
    }
  }, [dispatch, handleMenuClose, activeMenu, id]);

  const handleDeleteClick = useCallback(() => {
    if (activeMenu) {
      dispatch(expensesDeleteExpenseProposal(id, activeMenu.expenseId));
      handleMenuClose();
    }
  }, [dispatch, handleMenuClose, activeMenu, id]);

  return expenses.length || loading ? (
    <Fragment>
      <div css={classes.expenseList}>
        {expenses.map((expense) => (
          <Card key={expense.id} css={classes.expenseListItem} raised>
            <CardHeader
              avatar={
                <AccountAvatar
                  initials={getUserInitials(expense.createdBy)}
                  color={expense.createdBy.color}
                />
              }
              title={expense.name}
              subheader={getExpenseAmountString(expense)}
              action={
                shouldShowMenuButton(expense) ? (
                  <IconButton
                    aria-label="settings"
                    onClick={(e) =>
                      handleMenuClick(e, expense.id, expense.createdBy.id)
                    }
                    aria-haspopup="true"
                    size="large"
                  >
                    <MoreVert />
                  </IconButton>
                ) : null
              }
            />
            <CardContent>
              <Typography variant="body2">{expense.description}</Typography>
              <hr />
              <div>
                <span css={classes.expenseMembers}>
                  <Typography variant="subtitle2">For:</Typography>
                  {expense.users.map((participant) => (
                    <AccountAvatar
                      key={participant.id}
                      initials={getUserInitials(participant)}
                      color={participant.color}
                      css={classes.memberListAvatar}
                    />
                  ))}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Menu
        id="simple-menu"
        anchorEl={activeMenu?.anchorEl}
        open={!!activeMenu}
        onClose={handleMenuClose}
      >
        {activeMenu?.expenseCreatorId === currentUserId ? (
          <MenuItem onClick={handleEditClick}>Edit</MenuItem>
        ) : null}
        <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
      </Menu>
    </Fragment>
  ) : (
    <NoContent text="This meeting has no expenses yet!" />
  );
};

export default ExpensesList;

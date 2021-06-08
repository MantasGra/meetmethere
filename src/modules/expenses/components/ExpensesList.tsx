import { IconButton, Menu, MenuItem } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import { MoreVert } from '@material-ui/icons';
import { isNumber } from 'lodash';
import React from 'react';
import { useParams } from 'react-router';
import NoContent from 'src/components/NoContent';
import { useInfiniteScroll } from 'src/hooks/infiniteScroll';
import AccountAvatar from 'src/modules/auth/components/AccountAvatar';
import { useAppDispatch } from '../../../hooks/redux';
import {
  expensesDeleteExpenseProposal,
  expensesFormDialogExpenseIdentifierChangeRequest,
  expensesLoadExpensesProposal,
} from '../actions';
import type { IExpense } from '../reducer';
import {
  expensesHasMoreSelector,
  expensesListSelector,
  expensesLoadFailedSelector,
  expensesLoadingSelector,
} from '../selectors';
import classes from './ExpensesList.module.scss';

interface IMeetingPageParams {
  id: string;
}

const ExpensesList: React.FC = () => {
  const { id: idString } = useParams<IMeetingPageParams>();
  const id = parseInt(idString);
  const {
    loading,
    list: expenses,
    lastElementRef,
  } = useInfiniteScroll(
    expensesLoadingSelector,
    expensesHasMoreSelector,
    expensesListSelector,
    expensesLoadFailedSelector,
    (page) => expensesLoadExpensesProposal(id, page),
  );
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorObj, setAnchorObj] = React.useState<IExpense | null>(null);

  const handleClick = (event: any, expense: IExpense) => {
    setAnchorEl(event.currentTarget);
    setAnchorObj(expense);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setAnchorObj(null);
  };

  const handleEdit = (expense: IExpense) => {
    dispatch(
      expensesFormDialogExpenseIdentifierChangeRequest({
        meetingId: id,
        expenseId: expense.id,
      }),
    );
    setAnchorEl(null);
    setAnchorObj(null);
  };

  const handleDelete = (expense: IExpense) => {
    dispatch(expensesDeleteExpenseProposal(expense, id));
    setAnchorEl(null);
    setAnchorObj(null);
  };
  return expenses.length || loading ? (
    <>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && Boolean(anchorObj)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => handleEdit(anchorObj!)}>Edit</MenuItem>
        <MenuItem onClick={() => handleDelete(anchorObj!)}>Delete</MenuItem>
      </Menu>
      <div className={classes.expenseList}>
        {expenses
          .filter((e) => e !== undefined)
          .map((expense, index) => (
            <Card
              key={expense.id}
              className={classes.expenseListItem}
              raised
              ref={expenses.length - 1 === index ? lastElementRef : undefined}
            >
              <CardHeader
                avatar={
                  <AccountAvatar
                    initials={`${expense.createdBy.name.charAt(
                      0,
                    )}${expense.createdBy.lastName.charAt(0)}`}
                    color={expense.createdBy.color}
                  />
                }
                title={expense.name}
                subheader={`${
                  expense.amount ? (expense.amount * 1).toFixed(2) : 0
                }€ (${
                  expense.amount
                    ? (expense.amount / expense.users.length).toFixed(2)
                    : 0
                }€ each)`}
                action={
                  <IconButton
                    aria-label="settings"
                    onClick={(e) => handleClick(e, expense)}
                    aria-haspopup="true"
                  >
                    <MoreVert />
                  </IconButton>
                }
              />
              <CardContent>
                <Typography variant="body2" component="p">
                  {expense.description}
                </Typography>
                <hr />
                <Typography variant="body2" component="p">
                  <span className={classes.expenseMembers}>
                    <Typography variant="subtitle2">For:</Typography>
                    {expense.users.map((participant) => (
                      <AccountAvatar
                        key={participant.id}
                        initials={`${participant.name.charAt(
                          0,
                        )}${participant.lastName.charAt(0)}`}
                        color={participant.color}
                        className={classes.memberListAvatar}
                      />
                    ))}
                  </span>
                </Typography>
              </CardContent>
              <div></div>
            </Card>
          ))}
      </div>
    </>
  ) : (
    <NoContent text="This meeting has no expenses yet!" />
  );
};

export default ExpensesList;

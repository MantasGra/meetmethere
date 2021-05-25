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
  expensesHasMoreSelector,
  expensesListSelector,
  expensesLoadFailedSelector,
  expensesLoadingSelector,
} from '../selectors';
import { expensesLoadExpensesProposal } from '../actions';
import AccountAvatar from 'src/modules/auth/components/AccountAvatar';
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

  return expenses.length || loading ? (
    <div className={classes.expenseList}>
      {expenses.map((expense, index) => (
        <Card
          key={expense.id}
          className={classes.announcementListItem}
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
            subheader={format(
              new Date(expense.createDate),
              'yyyy-MM-dd HH:mm',
            )}
          />
          <CardContent>
            <Typography variant="body2" component="p">
              {expense.description}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  ) : (
    <NoContent text="This meeting has no announcements yet!" />
  );
};

export default ExpensesList;

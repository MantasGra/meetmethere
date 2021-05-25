import React from 'react';
import { useParams } from 'react-router';
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
  console.log(expenses);
  return expenses.length || loading ? (
    <div className={classes.expenseList}>
      {expenses.map((expense, index) => (
        <Card
          key={expense.id}
          className={classes.expenseListItem}
          raised
          ref={expenses.length - 1 === index ? lastElementRef : undefined}
        >
          <CardHeader
            title={expense.name}
            subheader={`Amount: ${expense.amount}`}
          />
          <CardContent>
            <Typography variant="body2" component="p">
              {expense.description}
            </Typography>
            <hr />
            <Typography variant="body2" component="p">
              For:{expense.users.map((u) => u.name).join(',')}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  ) : (
    <NoContent text="This meeting has no expenses yet!" />
  );
};

export default ExpensesList;

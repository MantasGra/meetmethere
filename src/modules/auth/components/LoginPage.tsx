import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import LoginForm from './LoginForm';

import classes from './LoginPage.module.scss';

const LoginPage: React.FC = () => {
  return (
    <Container maxWidth="xs" className={classes.loginPageContainer}>
      <Paper elevation={3} className={classes.loginPagePaper}>
        <LoginForm />
      </Paper>
    </Container>
  );
};

export default LoginPage;

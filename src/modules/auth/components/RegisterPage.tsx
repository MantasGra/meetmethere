import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import RegisterForm from './RegisterForm';

import classes from './RegisterPage.module.scss';

const RegisterPage: React.FC = () => {
  return (
    <Container maxWidth="xs" className={classes.registerPageContainer}>
      <Paper elevation={3} className={classes.registerPagePaper}>
        <RegisterForm />
      </Paper>
    </Container>
  );
};

export default RegisterPage;

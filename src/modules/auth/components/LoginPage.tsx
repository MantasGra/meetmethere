import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

import LoginForm from './LoginForm';
import classes from './LoginPage.styles';

const LoginPage: React.FC = () => {
  return (
    <Container maxWidth="xs" css={classes.loginPageContainer}>
      <Paper elevation={3} css={classes.loginPagePaper}>
        <LoginForm />
      </Paper>
    </Container>
  );
};

export default LoginPage;

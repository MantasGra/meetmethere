import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

import RegisterForm from './RegisterForm';
import classes from './RegisterPage.styles';

const RegisterPage: React.FC = () => {
  return (
    <Container maxWidth="xs" css={classes.registerPageContainer}>
      <Paper elevation={3} css={classes.registerPagePaper}>
        <RegisterForm />
      </Paper>
    </Container>
  );
};

export default RegisterPage;

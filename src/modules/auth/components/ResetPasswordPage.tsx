import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

import classes from './RequestPasswordResetPage.styles';
import ResetPasswordForm from './ResetPasswordForm';

const ResetPasswordPage: React.FC = () => (
  <Container maxWidth="xs" css={classes.container}>
    <Paper elevation={3} css={classes.paper}>
      <ResetPasswordForm />
    </Paper>
  </Container>
);

export default ResetPasswordPage;

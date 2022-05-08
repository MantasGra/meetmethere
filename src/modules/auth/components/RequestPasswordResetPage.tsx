import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

import RequestPasswordResetForm from './RequestPasswordResetForm';
import classes from './RequestPasswordResetPage.styles';

const RequestPasswordResetPage: React.FC = () => (
  <Container maxWidth="xs" css={classes.container}>
    <Paper elevation={3} css={classes.paper}>
      <RequestPasswordResetForm />
    </Paper>
  </Container>
);

export default RequestPasswordResetPage;

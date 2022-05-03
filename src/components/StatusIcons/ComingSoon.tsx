import Typography from '@mui/material/Typography';
import { ComingSoonIcon } from 'src/icons';

import classes from './StatusIcon.styles';

const ComingSoon: React.FC = () => (
  <div css={classes.container}>
    <ComingSoonIcon css={classes.icon} />
    <Typography css={classes.text} align="center" variant="h4">
      Coming Soon!
    </Typography>
  </div>
);

export default ComingSoon;

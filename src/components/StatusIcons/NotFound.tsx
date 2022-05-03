import Typography from '@mui/material/Typography';
import { NotFoundIcon } from 'src/icons';

import classes from './StatusIcon.styles';

interface IProps {
  text: string;
}

const NotFound: React.FC<IProps> = ({ text }) => (
  <div css={classes.container}>
    <NotFoundIcon css={classes.icon} />
    <Typography css={classes.text} align="center" variant="h4">
      {text}
    </Typography>
  </div>
);

export default NotFound;

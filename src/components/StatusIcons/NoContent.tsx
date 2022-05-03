import Typography from '@mui/material/Typography';
import { NoContentIcon } from 'src/icons';

import classes from './StatusIcon.styles';

interface IProps {
  text: string;
}

const NoContent: React.FC<IProps> = ({ text }) => (
  <div css={classes.container}>
    <NoContentIcon css={classes.icon} />
    <Typography css={classes.text} align="center" variant="h4">
      {text}
    </Typography>
  </div>
);

export default NoContent;

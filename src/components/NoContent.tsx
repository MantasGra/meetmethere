import React from 'react';
import Typography from '@material-ui/core/Typography';
import { NoContentIcon } from 'src/icons';

import classes from './NoContent.module.scss';

interface IProps {
  text: string;
}

const NoContent: React.FC<IProps> = ({ text }) => (
  <div className={classes.noContentContainer}>
    <NoContentIcon className={classes.noContentIcon} />
    <Typography className={classes.noContentText} align="center" variant="h4">
      {text}
    </Typography>
  </div>
);

export default NoContent;

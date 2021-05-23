import React from 'react';
import Typography from '@material-ui/core/Typography';
import { NotFoundIcon } from 'src/icons';

import classes from './NotFound.module.scss';

interface IProps {
  text: string;
}

const NotFound: React.FC<IProps> = ({ text }) => (
  <div className={classes.notFoundContainer}>
    <NotFoundIcon className={classes.notFoundIcon} />
    <Typography className={classes.notFoundText} align="center" variant="h4">
      {text}
    </Typography>
  </div>
);

export default NotFound;

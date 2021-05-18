import React from 'react';
import Typography from '@material-ui/core/Typography';
import { ComingSoonIcon } from 'src/icons';

import classes from './ComingSoon.module.scss';

const ComingSoon: React.FC = () => (
  <div className={classes.comingSoonContainer}>
    <ComingSoonIcon className={classes.comingSoonIcon} />
    <Typography className={classes.comingSoonText} align="center" variant="h4">
      Coming Soon!
    </Typography>
  </div>
);

export default ComingSoon;

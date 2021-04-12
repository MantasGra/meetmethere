import React from 'react';
import { useLocation } from 'react-router';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import { Routes } from 'src/constants/enums';
import { useMatchRoutes } from 'src/hooks/router';
import getAppTitle from 'src/utils/getAppTitle';
import AccountInfo from 'src/modules/auth/components/AccountInfo';

import classes from './AppBar.module.scss';

const AppBar: React.FC = () => {
  const location = useLocation();

  const hideAccountInfo = useMatchRoutes(Routes.Login, Routes.Register);
  return (
    <MuiAppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title} align="left">
          {getAppTitle(location.pathname)}
        </Typography>
        {!hideAccountInfo ? <AccountInfo /> : null}
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;

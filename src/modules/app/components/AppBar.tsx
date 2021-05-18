import React from 'react';
import { useLocation } from 'react-router';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import { Routes } from 'src/constants/enums';
import { useMatchRoutes } from 'src/hooks/router';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import getAppTitle from 'src/utils/getAppTitle';
import AccountInfo from 'src/modules/auth/components/AccountInfo';
import { isMobileSelector } from '../selectors';

import classes from './AppBar.module.scss';
import { openMobileMenu } from '../actions';
import { isUserLoggedInSelector } from 'src/modules/auth/selectors';

const AppBar: React.FC = () => {
  const location = useLocation();
  const isMobile = useAppSelector(isMobileSelector);
  const isLoggedIn = useAppSelector(isUserLoggedInSelector);

  const dispatch = useAppDispatch();
  const onMobileMenuOpen = () => {
    dispatch(openMobileMenu(true));
  };

  const hideAccountInfo = useMatchRoutes(Routes.Login, Routes.Register);
  return (
    <MuiAppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        {isMobile && isLoggedIn && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMobileMenuOpen}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" className={classes.title} align="left">
          {getAppTitle(location.pathname)}
        </Typography>
        {!hideAccountInfo ? <AccountInfo /> : null}
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;

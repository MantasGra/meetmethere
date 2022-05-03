import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router';
import { Routes } from 'src/constants/enums';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import { useMatchRoutes } from 'src/hooks/router';
import AccountInfo from 'src/modules/auth/components/AccountInfo';
import { isUserLoggedInSelector } from 'src/modules/auth/selectors';
import getAppTitle from 'src/utils/getAppTitle';

import { openMobileMenu } from '../actions';
import { isMobileSelector } from '../selectors';

import classes from './AppBar.styles';

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
    <MuiAppBar position="fixed" css={classes.appBar}>
      <Toolbar>
        {isMobile && isLoggedIn && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMobileMenuOpen}
            size="large"
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" css={classes.title} align="left">
          {getAppTitle(location.pathname)}
        </Typography>
        {!hideAccountInfo ? <AccountInfo /> : null}
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;

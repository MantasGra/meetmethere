import React from 'react';
import { useHistory, useLocation } from 'react-router';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import EventIcon from '@material-ui/icons/Event';
import HistoryIcon from '@material-ui/icons/History';
import EmailIcon from '@material-ui/icons/Email';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import { Routes } from 'src/constants/enums';
import { isMobileMenuOpenSelector, isMobileSelector } from '../selectors';
import { openMobileMenu } from '../actions';

import classes from './Navigation.module.scss';

const Navigation: React.FC = () => {
  const isMobile = useAppSelector(isMobileSelector);
  const isMobileMenuOpen = useAppSelector(isMobileMenuOpenSelector);

  const dispatch = useAppDispatch();
  const onMobileMenuClose = () => {
    dispatch(openMobileMenu(false));
  };

  const navigationItems = [
    {
      text: 'Planned Meetings',
      Icon: EventIcon,
      route: Routes.Meetings,
    },
    {
      text: 'Meeting History',
      Icon: HistoryIcon,
      route: Routes.History,
    },
    {
      text: 'Invitations',
      Icon: EmailIcon,
      route: Routes.Invitations,
    },
  ];

  const history = useHistory();
  const location = useLocation();
  const goToRoute = (route: Routes) => {
    history.push(route);
  };

  const drawerContents = (
    <>
      {!isMobile && <Toolbar />}
      <div className={classes.drawerContainer}>
        <List>
          {navigationItems.map((item) => (
            <ListItem
              button
              key={item.text}
              selected={item.route === location.pathname}
              onClick={() => goToRoute(item.route)}
            >
              <ListItemIcon>
                <item.Icon />
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </div>
    </>
  );

  return (
    <nav>
      {isMobile ? (
        <Drawer
          variant="temporary"
          className={classes.drawer}
          classes={{ paper: classes.drawerPaper }}
          open={isMobileMenuOpen}
          onClose={onMobileMenuClose}
          ModalProps={{ keepMounted: true }}
        >
          {drawerContents}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          className={classes.drawer}
          classes={{ paper: classes.drawerPaper }}
        >
          {drawerContents}
        </Drawer>
      )}
    </nav>
  );
};

export default Navigation;

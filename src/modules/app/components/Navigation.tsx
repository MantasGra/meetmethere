import { ClassNames } from '@emotion/react';
import EmailIcon from '@mui/icons-material/Email';
import EventIcon from '@mui/icons-material/Event';
import HistoryIcon from '@mui/icons-material/History';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Routes } from 'src/constants/enums';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';

import { openMobileMenu } from '../actions';
import { isMobileMenuOpenSelector, isMobileSelector } from '../selectors';

import classes from './Navigation.styles';

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

  const navigate = useNavigate();
  const location = useLocation();
  const goToRoute = (route: Routes) => {
    navigate(route);
  };

  const drawerContents = (
    <Fragment>
      <div css={classes.drawerContainer}>
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
    </Fragment>
  );

  return (
    <nav>
      <ClassNames>
        {({ css }) => (
          <Fragment>
            {isMobile ? (
              <Drawer
                variant="temporary"
                css={classes.drawer}
                classes={{
                  paper: css`
                    ${classes.drawerPaper};
                  `,
                }}
                open={isMobileMenuOpen}
                onClose={onMobileMenuClose}
                ModalProps={{ keepMounted: true }}
              >
                {drawerContents}
              </Drawer>
            ) : (
              <Drawer
                variant="permanent"
                css={classes.drawer}
                classes={{
                  paper: css`
                    ${classes.drawerPaper};
                  `,
                }}
              >
                {drawerContents}
              </Drawer>
            )}
          </Fragment>
        )}
      </ClassNames>
    </nav>
  );
};

export default Navigation;

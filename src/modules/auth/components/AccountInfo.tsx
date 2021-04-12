import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';

import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import { authOpenLoginProposal, authLogoutProposal } from '../actions';
import { accountEmailSelector, isUserLoggedInSelector } from '../selectors';

import classes from './AccountInfo.module.scss';
import { Typography } from '@material-ui/core';

const AccountInfo: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const isUserLoggedIn = useAppSelector(isUserLoggedInSelector);
  const accountEmail = useAppSelector(accountEmailSelector);

  const dispatch = useAppDispatch();

  const onLoginClick = () => {
    dispatch(authOpenLoginProposal());
  };

  const onLogoutClick = () => {
    dispatch(authLogoutProposal());
    setAnchorEl(null);
  };

  const onAccountClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onPopoverClose = () => {
    setAnchorEl(null);
  };

  const open = !!anchorEl;
  const id = open ? 'account-popover' : undefined;

  return isUserLoggedIn ? (
    <>
      <IconButton edge="end" color="inherit" onClick={onAccountClick}>
        <AccountCircle />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={onPopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <div className={classes.accountInfoPopoverContainer}>
          <Typography gutterBottom>{accountEmail}</Typography>
          <Divider />
          <Button fullWidth size="small" onClick={onLogoutClick}>
            Logout
          </Button>
        </div>
      </Popover>
    </>
  ) : (
    <Button color="inherit" onClick={onLoginClick}>
      Login
    </Button>
  );
};

export default AccountInfo;

import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import AccountAvatar from './AccountAvatar';
import { authOpenLoginProposal, authLogoutProposal } from '../actions';
import {
  accountAvatarDataSelector,
  accountEmailSelector,
  accountFullNameSelector,
  isUserLoggedInSelector,
} from '../selectors';

import classes from './AccountInfo.module.scss';

const AccountInfo: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const isUserLoggedIn = useAppSelector(isUserLoggedInSelector);
  const accountEmail = useAppSelector(accountEmailSelector);
  const accountFullName = useAppSelector(accountFullNameSelector);
  const accountAvatarData = useAppSelector(accountAvatarDataSelector);

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
        <AccountAvatar
          initials={accountAvatarData.accountInitials}
          color={accountAvatarData.color}
        />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={onPopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <div className={classes.accountInfoPopoverContainer}>
          <Typography>{accountFullName}</Typography>
          <Typography variant="body2" gutterBottom>
            {accountEmail}
          </Typography>
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

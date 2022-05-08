import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useState, Fragment } from 'react';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';

import {
  authOpenLoginProposal,
  authLogoutProposal,
  authChangePasswordDialogVisibleChangeRequest,
} from '../actions';
import {
  accountAvatarDataSelector,
  accountEmailSelector,
  accountFullNameSelector,
  isUserLoggedInSelector,
} from '../selectors';

import AccountAvatar from './AccountAvatar';
import classes from './AccountInfo.styles';

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

  const onChangePasswordClick = () => {
    dispatch(authChangePasswordDialogVisibleChangeRequest(true));
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
    <Fragment>
      <IconButton
        edge="end"
        color="inherit"
        onClick={onAccountClick}
        size="large"
      >
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
        <div css={classes.accountInfoPopoverContainer}>
          <Typography>{accountFullName}</Typography>
          <Typography variant="body2" gutterBottom>
            {accountEmail}
          </Typography>
          <Divider />
          <Button fullWidth size="small" onClick={onChangePasswordClick}>
            Change password
          </Button>
          <Button fullWidth size="small" onClick={onLogoutClick}>
            Logout
          </Button>
        </div>
      </Popover>
    </Fragment>
  ) : (
    <Button color="inherit" onClick={onLoginClick}>
      Login
    </Button>
  );
};

export default AccountInfo;

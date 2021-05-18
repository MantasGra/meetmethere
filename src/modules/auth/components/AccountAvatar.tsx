import React from 'react';
import Avatar from '@material-ui/core/Avatar';

interface IProps {
  initials: string;
  color: string;
  className?: string;
}

const AccountAvatar: React.FC<IProps> = ({ initials, color, className }) => (
  <Avatar style={{ backgroundColor: color }} className={className}>
    {initials}
  </Avatar>
);

export default AccountAvatar;

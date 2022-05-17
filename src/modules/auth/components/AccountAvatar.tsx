import Avatar from '@mui/material/Avatar';
import { getContrastingColor } from 'src/utils/getConrastingColor';

interface IProps {
  initials: string;
  color: string;
  className?: string;
}

const AccountAvatar: React.FC<IProps> = ({ initials, color, className }) => (
  <Avatar
    style={{ backgroundColor: color, color: getContrastingColor(color) }}
    className={className}
  >
    {initials}
  </Avatar>
);

export default AccountAvatar;

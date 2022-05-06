import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import classes from './CloseableDialogTitle.styles';

interface ICloseableDialogTitleProps {
  children: React.ReactNode;
  onClose: () => void;
}

const CloseableDialogTitle: React.FC<ICloseableDialogTitleProps> = (props) => {
  const { children, onClose, ...rest } = props;
  return (
    <DialogTitle {...rest}>
      <Typography variant="h6" component="span">
        {children}
      </Typography>
      <IconButton onClick={onClose} css={classes.closeButton} size="large">
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  );
};

export default CloseableDialogTitle;

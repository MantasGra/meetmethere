import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

import classes from './CloseableDialogTitle.module.scss';

interface ICloseableDialogTitleProps {
  children: React.ReactNode;
  onClose: () => void;
}

const CloseableDialogTitle: React.FC<ICloseableDialogTitleProps> = (props) => {
  const { children, onClose, ...rest } = props;
  return (
    <DialogTitle disableTypography {...rest}>
      <Typography variant="h6">{children}</Typography>
      <IconButton onClick={onClose} className={classes.closeButton}>
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  );
};

export default CloseableDialogTitle;

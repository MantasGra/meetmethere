import React, { useEffect } from 'react';
import { SnackbarKey, useSnackbar } from 'notistack';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import { notificationsSelector } from '../selectors';
import { snackbarsRemove } from '../actions';

let displayed: SnackbarKey[] = [];

const Notifier: React.FC = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(notificationsSelector);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const storeDisplayed = (id: SnackbarKey) => {
    displayed = [...displayed, id];
  };

  const removeDisplayed = (id: SnackbarKey) => {
    displayed = [...displayed.filter((key) => id !== key)];
  };

  useEffect(() => {
    notifications.forEach(
      ({ key, message, options = {}, dismissed = false }) => {
        if (dismissed) {
          closeSnackbar(key);
          return;
        }

        if (displayed.includes(key)) return;

        enqueueSnackbar(message, {
          key,
          ...options,
          onClose: (event, reason, myKey) => {
            if (options.onClose) {
              options.onClose(event, reason, myKey);
            }
          },
          onExited: (_, myKey) => {
            dispatch(snackbarsRemove(myKey));
            removeDisplayed(myKey);
          },
        });

        storeDisplayed(key);
      },
    );
  }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);

  return null;
};

export default Notifier;

import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios, { AxiosResponse } from 'axios';
import { throttle, omit } from 'lodash';
import { Fragment, useState, useEffect, useMemo } from 'react';
import getConfig from 'src/config/config';
import AccountAvatar from 'src/modules/auth/components/AccountAvatar';

import classes from './UserAutocomplete.styles';

export interface IUser {
  id: number;
  name: string;
  lastName: string;
  color: string;
}

interface IOptionsResponse {
  options: IUser[];
}

interface IUserAutocompleteProps<DisableClearable extends boolean | undefined>
  extends Omit<
    AutocompleteProps<IUser, true, DisableClearable, false>,
    'renderInput' | 'options'
  > {
  optionsUrl: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  realValue: IUser[];
  onRealValueChange: (value: IUser[]) => void;
}

const UserAutocomplete = <
  DisableClearable extends boolean | undefined = undefined,
>(
  props: IUserAutocompleteProps<DisableClearable>,
): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<IUser[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const loading = open && options.length === 0;

  const fetchUsers = useMemo(() => {
    const config = getConfig();
    return throttle(
      (searchText: string, callback: (results: IUser[]) => void) => {
        axios
          .get(`${config.backendBaseUrl}${props.optionsUrl}`, {
            params: { searchText },
            withCredentials: true,
          })
          .then((response: AxiosResponse<IOptionsResponse>) =>
            callback(response.data.options),
          )
          .catch(() => callback([]));
      },
      200,
    );
  }, [props.optionsUrl]);

  useEffect(() => {
    let active = true;

    fetchUsers(searchText, (options) => {
      if (active) {
        setOptions(options);
      }
    });

    return () => {
      active = false;
    };
  }, [loading, searchText, fetchUsers]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      {...omit(
        props,
        'realValue',
        'onRealValueChange',
        'error',
        'helperText',
        'optionsUrl',
        'label',
      )}
      multiple
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      options={options}
      loading={loading}
      onInputChange={(_, newInputValue) => {
        setSearchText(newInputValue);
      }}
      value={props.realValue}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(_, value) => {
        props.onRealValueChange(value);
      }}
      getOptionLabel={(option) => `${option.name} ${option.lastName}`}
      renderOption={(props, option) => (
        <li {...props}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <AccountAvatar
                initials={`${option.name.charAt(0)}${option.lastName.charAt(
                  0,
                )}`}
                color={option.color}
                css={classes.avatarSize}
              />
            </Grid>
            <Grid item xs>
              <Typography variant="body2" color="textSecondary">
                {`${option.name} ${option.lastName}`}
              </Typography>
            </Grid>
          </Grid>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          margin="dense"
          label={props.label}
          helperText={props.helperText}
          error={props.error}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
        />
      )}
    />
  );
};

export default UserAutocomplete;

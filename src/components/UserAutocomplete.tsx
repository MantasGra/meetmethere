import React, { useState, useEffect, useMemo } from 'react';
import axios, { AxiosResponse } from 'axios';
import { throttle, omit } from 'lodash';
import Autocomplete, { AutocompleteProps } from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import getConfig from 'src/config/config';
import AccountAvatar from 'src/modules/auth/components/AccountAvatar';
import classes from './UserAutocomplete.module.scss';

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
  helperText?: string;
  error?: boolean;
  realValue: IUser[];
  onRealValueChange: (value: IUser[]) => void;
}

const UserAutocomplete = <
  DisableClearable extends boolean | undefined = undefined
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
          .get(`${config.backendBaseUrl}/user/selectOptions`, {
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
  }, []);

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
  }, [loading, searchText]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      {...omit(props, 'realValue', 'onRealValueChange', 'error', 'helperText')}
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
      getOptionSelected={(option, value) => option.id === value.id}
      onChange={(_, value) => {
        props.onRealValueChange(value);
      }}
      getOptionLabel={(option) => `${option.name} ${option.lastName}`}
      renderOption={(option) => (
        <Grid container alignItems="center" spacing={1}>
          <Grid item>
            <AccountAvatar
              initials={`${option.name.charAt(0)}${option.lastName.charAt(0)}`}
              color={option.color}
              className={classes.avatarSize}
            />
          </Grid>
          <Grid item xs>
            <Typography variant="body2" color="textSecondary">
              {`${option.name} ${option.lastName}`}
            </Typography>
          </Grid>
        </Grid>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          margin="dense"
          label="Members"
          helperText={props.helperText}
          error={props.error}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default UserAutocomplete;

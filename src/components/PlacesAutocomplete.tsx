import React, { useState, useEffect, useMemo } from 'react';
import { throttle, omit } from 'lodash';
import Autocomplete, { AutocompleteProps } from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Typography from '@material-ui/core/Typography';
import parse from 'autosuggest-highlight/parse';

import classes from './PlacesAutocomplete.module.scss';

type PlaceType = Pick<
  google.maps.places.AutocompletePrediction,
  'description' | 'structured_formatting' | 'place_id'
>;

export interface IValue {
  place: PlaceType | null;
  input: string;
}

interface IPlacesAutocompleteProps
  extends Omit<
    AutocompleteProps<PlaceType | null, false, false, false>,
    'renderInput' | 'options'
  > {
  realValue: IValue;
  onRealValueChange: (value: IValue) => void;
  variant?: 'outlined' | 'filled' | 'standard';
  className?: string;
}

interface IAutoCompleteServiceInstance {
  current: google.maps.places.AutocompleteService | null;
}

interface IAutoCompleteSessionToken {
  current: google.maps.places.AutocompleteSessionToken | null;
}

const autocompleteService: IAutoCompleteServiceInstance = { current: null };
const autocompleteSessionToken: IAutoCompleteSessionToken = { current: null };

const PlacesAutocomplete = (props: IPlacesAutocompleteProps): JSX.Element => {
  const [options, setOptions] = useState<PlaceType[]>([]);

  const fetch = useMemo(
    () =>
      throttle(
        (
          request: {
            input: string;
            sessionToken: google.maps.places.AutocompleteSessionToken;
          },
          callback: (results: PlaceType[] | null) => void,
        ) => {
          autocompleteService.current?.getPlacePredictions(request, callback);
        },
        200,
      ),
    [],
  );

  useEffect(() => {
    let active = true;
    if (!autocompleteService.current) {
      autocompleteService.current = new google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }
    if (!autocompleteSessionToken.current) {
      autocompleteSessionToken.current = new google.maps.places.AutocompleteSessionToken();
    }
    if (props.realValue.input === '') {
      setOptions(props.realValue.place ? [props.realValue.place] : []);
      return undefined;
    }
    fetch(
      {
        input: props.realValue.input,
        sessionToken: autocompleteSessionToken.current,
      },
      (results) => {
        if (active) {
          let newOptions: PlaceType[] = [];
          if (props.realValue.place) {
            newOptions = [props.realValue.place];
          }

          if (results) {
            newOptions = [...newOptions, ...results];
          }

          setOptions(newOptions);
        }
      },
    );
    return () => {
      active = false;
    };
  }, [props.realValue.place, props.realValue.input, fetch]);

  return (
    <Autocomplete
      {...omit(props, 'realValue', 'onRealValueChange', 'ref')}
      className={props.className}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.description
      }
      filterOptions={(x) => x}
      options={options}
      includeInputInList
      filterSelectedOptions
      value={props.realValue.place}
      onChange={(_, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        props.onRealValueChange({
          ...props.realValue,
          place: newValue,
        });
        autocompleteSessionToken.current = null;
      }}
      onInputChange={(_, newInputValue, reason) => {
        if (newInputValue || reason !== 'reset') {
          props.onRealValueChange({
            ...props.realValue,
            input: newInputValue,
          });
        }
      }}
      inputValue={props.realValue.input}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Location"
          margin="dense"
          variant={props.variant}
          fullWidth
        />
      )}
      renderOption={(option) => {
        const matches =
          option.structured_formatting.main_text_matched_substrings;
        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match) => [match.offset, match.offset + match.length]),
        );

        return (
          <Grid container alignItems="center">
            <Grid item>
              <LocationOnIcon className={classes.icon} />
            </Grid>
            <Grid item xs>
              {parts.map((part, index) => (
                <span
                  key={index}
                  style={{ fontWeight: part.highlight ? 700 : 400 }}
                >
                  {part.text}
                </span>
              ))}
              <Typography variant="body2" color="textSecondary">
                {option.structured_formatting.secondary_text}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
    />
  );
};

export default PlacesAutocomplete;

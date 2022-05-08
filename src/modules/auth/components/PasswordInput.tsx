import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import { useCallback } from 'react';
import { Controller, UseControllerProps } from 'react-hook-form';
import useToggle from 'src/hooks/useToggle';

interface IProps<T> extends UseControllerProps<T> {
  id: string;
  label: string;
  autoComplete?: string;
  error?: string;
}

function PasswordInput<T>(props: IProps<T>) {
  const { error, id, label, autoComplete, ...controllerProps } = props;

  const [visible, toggleVisible] = useToggle(false);

  const handleToggleClick = useCallback(() => toggleVisible(), [toggleVisible]);

  return (
    <Controller
      render={({ field }) => (
        <FormControl
          error={!!error}
          variant="standard"
          margin="dense"
          fullWidth
        >
          <InputLabel htmlFor={id}>{label}</InputLabel>
          <Input
            {...field}
            id={id}
            type={visible ? 'text' : 'password'}
            autoComplete={autoComplete}
            inputProps={{ maxLength: 100 }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  id={`${id}-passwordVisibilityButton`}
                  onClick={handleToggleClick}
                  type="button"
                  size="large"
                >
                  {visible ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            aria-describedby={`${id}-error-text`}
          />
          {error && (
            <FormHelperText id={`${id}-error-text`}>{error}</FormHelperText>
          )}
        </FormControl>
      )}
      {...controllerProps}
    />
  );
}

export default PasswordInput;

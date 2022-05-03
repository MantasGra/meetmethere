import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import { useMemo, useCallback } from 'react';
import type { IUser } from 'src/modules/auth/reducer';
import { getFullName } from 'src/modules/auth/selectors';

export interface ExpenseFormUserListProps {
  userOptions: IUser[];
  selectedUserIds: number[];
  onSelectedUserIdsChange(users: number[]): void;
  error?: string;
}

const transformUserToOption = (user: IUser) => ({
  id: user.id,
  label: getFullName(user),
});

const ExpenseFormUserList: React.FC<ExpenseFormUserListProps> = ({
  userOptions,
  selectedUserIds,
  onSelectedUserIdsChange,
  error,
}) => {
  // Derived values
  const transformedUserOptions = useMemo(
    () => userOptions.map(transformUserToOption),
    [userOptions],
  );

  const allSelected = useMemo(
    () => userOptions.length === selectedUserIds.length,
    [userOptions, selectedUserIds],
  );

  const anySelected = useMemo(
    () => !!selectedUserIds.length,
    [selectedUserIds],
  );

  const isSelectedGetter = useCallback(
    (userId: number) => selectedUserIds.includes(userId),
    [selectedUserIds],
  );

  // Event handlers
  const handleSelectUser = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, userId: number) => {
      const selected = event.target.checked;
      if (selected) {
        onSelectedUserIdsChange([...selectedUserIds, userId]);
      } else {
        onSelectedUserIdsChange(
          selectedUserIds.filter((selectedId) => selectedId !== userId),
        );
      }
    },
    [onSelectedUserIdsChange, selectedUserIds],
  );

  const handleSelectAll = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selected = event.target.checked;
      if (selected) {
        onSelectedUserIdsChange(
          transformedUserOptions.map((option) => option.id),
        );
      } else {
        onSelectedUserIdsChange([]);
      }
    },
    [onSelectedUserIdsChange, transformedUserOptions],
  );

  return (
    <FormControl error={!!error} component="fieldset" fullWidth>
      <FormLabel component="legend">Select payees</FormLabel>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={allSelected}
              indeterminate={!allSelected && anySelected}
              onChange={handleSelectAll}
            />
          }
          label="Select All"
        />
        <Divider />
        {transformedUserOptions.map((option) => (
          <FormControlLabel
            key={option.id}
            control={
              <Checkbox
                checked={isSelectedGetter(option.id)}
                onChange={(event) => handleSelectUser(event, option.id)}
              />
            }
            label={option.label}
          />
        ))}
      </FormGroup>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default ExpenseFormUserList;

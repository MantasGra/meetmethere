import { omit } from 'lodash';
import React from 'react';
import Button from '@material-ui/core/Button/Button';
import { FieldError, useForm, Controller } from 'react-hook-form';
import UserAutocomplete from 'src/components/UserAutocomplete';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import type { IUser } from 'src/modules/auth/reducer';
import { invitationsInviteUserDialogMeetingIdSelector } from '../selectors';

import classes from './InviteUserForm.module.scss';
import { invitationsInviteUsersToMeeting } from '../actions';

interface IInviteUserForm {
  users: IUser[];
}

const InviteUserForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IInviteUserForm>();

  const dispatch = useAppDispatch();

  const meetingId = useAppSelector(
    invitationsInviteUserDialogMeetingIdSelector,
  );

  const onSubmit = (data: IInviteUserForm) => {
    if (meetingId) {
      dispatch(
        invitationsInviteUsersToMeeting(
          meetingId,
          data.users.map((user) => user.id),
        ),
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        render={({ field }) => (
          <UserAutocomplete
            {...omit(field, 'value', 'onChange', 'ref')}
            label="Add members"
            optionsUrl={`/meeting/${meetingId}/invitationOptions`}
            helperText={
              (errors.users as FieldError | undefined)?.type === 'validate'
                ? 'Select at least one member to invite'
                : undefined
            }
            error={!!errors.users}
            realValue={field.value}
            onRealValueChange={(newValue) => field.onChange(newValue)}
          />
        )}
        name="users"
        control={control}
        defaultValue={[]}
        rules={{
          validate: (value) => !!value.length,
        }}
      />
      <div className={classes.submitContainer}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.submitButton}
        >
          Invite
        </Button>
      </div>
    </form>
  );
};

export default InviteUserForm;

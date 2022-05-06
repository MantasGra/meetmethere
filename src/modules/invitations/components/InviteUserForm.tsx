import { omit } from 'lodash';
import { FieldError, useForm, Controller } from 'react-hook-form';
import UserAutocomplete from 'src/components/UserAutocomplete';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import type { IUser } from 'src/modules/auth/reducer';
import SubmitButton from 'src/modules/formSubmitBlocker/components/SubmitButton';

import { invitationsInviteUsersToMeeting } from '../actions';
import { invitationsInviteUserDialogMeetingIdSelector } from '../selectors';

import classes from './InviteUserForm.styles';

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
    <form>
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
      <div css={classes.submitContainer}>
        <SubmitButton
          type="button"
          variant="contained"
          color="primary"
          css={classes.submitButton}
          onClick={handleSubmit(onSubmit)}
        >
          Invite
        </SubmitButton>
      </div>
    </form>
  );
};

export default InviteUserForm;

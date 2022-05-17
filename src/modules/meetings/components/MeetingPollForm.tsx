import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { Divider } from '@mui/material';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import { differenceInMinutes, isAfter } from 'date-fns';
import format from 'date-fns/format';
import { omit } from 'lodash';
import { useEffect, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useAppSelector, useAppDispatch } from 'src/hooks/redux';
import usePreviousConditional from 'src/hooks/usePreviousConditional';
import { isMobileSelector } from 'src/modules/app/selectors';
import { authCurrentUserIdSelector } from 'src/modules/auth/selectors';
import SubmitButton from 'src/modules/formSubmitBlocker/components/SubmitButton';
import { toDate } from 'src/utils/transformators';

import { meetingsMeetingPollDatesResponseChangeRequest } from '../actions';
import type { IMeetingDatesPollEntry } from '../reducer';
import {
  meetingsDatesPollEntriesSelector,
  meetingsIsMeetingArchived,
  meetingsMeetingDatesPollFormIdSelector,
  meetingsMeetingHasUserPollEntryAdditionsEnabledSelector,
} from '../selectors';

import classes from './MeetingPollForm.styles';

export interface IMeetingPollForm {
  selections: Array<{ id: number; selected: boolean; count: number }>;
  newOptions: Array<{ startDate: Date; endDate: Date }>;
}

const MeetingPollForm: React.FC = () => {
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<IMeetingPollForm>();

  const { fields, remove, append } = useFieldArray({
    control,
    name: 'newOptions',
  });

  const meetingDatesPollFormId = useAppSelector(
    meetingsMeetingDatesPollFormIdSelector,
  );

  const meetingCanUsersCreatePollEntries = useAppSelector(
    (state) =>
      meetingDatesPollFormId &&
      meetingsMeetingHasUserPollEntryAdditionsEnabledSelector(
        state,
        meetingDatesPollFormId,
      ),
  );

  const isMeetingHistoric = useAppSelector(
    (state) =>
      meetingDatesPollFormId &&
      meetingsIsMeetingArchived(state, meetingDatesPollFormId),
  );

  const isMeetingHistoricRendered = usePreviousConditional(
    isMeetingHistoric,
    !meetingDatesPollFormId,
  );

  const currentUserId = useAppSelector(authCurrentUserIdSelector);

  const meetingDatesPollEntries = useAppSelector((state) =>
    meetingDatesPollFormId
      ? meetingsDatesPollEntriesSelector(state, meetingDatesPollFormId)
      : [],
  );

  const meetingDatesPollEntriesMap = useMemo<
    Record<number, IMeetingDatesPollEntry>
  >(
    () =>
      meetingDatesPollEntries.reduce(
        (map, value) => ({ ...map, [value.id]: value }),
        {},
      ),
    [meetingDatesPollEntries],
  );

  const { fields: selections } = useFieldArray({
    control,
    name: 'selections',
    keyName: 'formKey',
  });

  useEffect(() => {
    if (meetingDatesPollEntries.length) {
      setValue(
        'selections',
        meetingDatesPollEntries.map((value) => ({
          id: value.id,
          selected: value.users.some((user) => user.id === currentUserId),
          count: value.users.length,
        })),
      );
    }
  }, [meetingDatesPollEntries, currentUserId, setValue]);

  const dispatch = useAppDispatch();

  const onSubmit = (formData: IMeetingPollForm) => {
    if (meetingDatesPollFormId) {
      dispatch(
        meetingsMeetingPollDatesResponseChangeRequest({
          votes: formData.selections.reduce(
            (votes, value) => ({
              ...votes,
              [value.id]: value.selected,
            }),
            {},
          ),
          newMeetingDatesPollEntries: formData.newOptions,
          meetingId: meetingDatesPollFormId,
        }),
      );
    }
  };

  const isMobile = useAppSelector(isMobileSelector);

  return (
    <form>
      <FormControl component="fieldset" disabled={!!isMeetingHistoricRendered}>
        <FormGroup>
          {selections.map((entry, index) => {
            return (
              <FormControlLabel
                key={entry.formKey}
                control={
                  <Controller
                    name={`selections.${index}.selected` as const}
                    control={control}
                    render={(props) => (
                      <Checkbox
                        checked={props.field.value}
                        onChange={(e) => props.field.onChange(e.target.checked)}
                      />
                    )}
                    defaultValue={entry.selected}
                  />
                }
                label={`${
                  meetingDatesPollEntriesMap[entry.id]
                    ? format(
                        toDate(meetingDatesPollEntriesMap[entry.id].startDate),
                        'yyyy-MM-dd HH:mm',
                      )
                    : ''
                } - ${
                  meetingDatesPollEntriesMap[entry.id]
                    ? format(
                        toDate(meetingDatesPollEntriesMap[entry.id].endDate),
                        'yyyy-MM-dd HH:mm',
                      )
                    : ''
                } (${entry.count})`}
              />
            );
          })}
        </FormGroup>
      </FormControl>
      {!isMeetingHistoricRendered &&
        fields.map((item, index) => {
          return (
            <div css={classes.dateFields} key={item.id}>
              <Controller
                render={({ field }) => (
                  <DateTimePicker
                    {...omit(field, 'ref')}
                    label="Start Date"
                    disablePast
                    renderInput={(props) => (
                      <TextField {...props} margin="dense" variant="outlined" />
                    )}
                  />
                )}
                name={`newOptions.${index}.startDate` as const}
                control={control}
                defaultValue={new Date()}
              />
              <Controller
                render={({ field }) => (
                  <DateTimePicker
                    {...omit(field, 'ref')}
                    label="End Date"
                    disablePast
                    renderInput={(props) => (
                      <TextField
                        {...props}
                        helperText={
                          errors.newOptions?.[index]?.endDate?.type ===
                          'validate'
                            ? 'End date must be after start date'
                            : undefined
                        }
                        error={!!errors.newOptions?.[index]?.endDate}
                        margin="dense"
                        variant="outlined"
                      />
                    )}
                  />
                )}
                name={`newOptions.${index}.endDate` as const}
                control={control}
                rules={{
                  validate: (value) =>
                    isAfter(value, item.startDate) &&
                    differenceInMinutes(value, item.startDate) > 0,
                }}
                defaultValue={new Date()}
              />
              <Button
                color="primary"
                startIcon={<DeleteIcon />}
                onClick={() => remove(index)}
              >
                Remove
              </Button>
              <Divider css={classes.divider} />
              {isMobile && fields.length - 1 !== index && (
                <Divider css={classes.divider} />
              )}
            </div>
          );
        })}

      {!isMeetingHistoricRendered && (
        <div css={classes.submitContainer}>
          <SubmitButton
            type="button"
            variant="contained"
            color="primary"
            css={classes.submitButton}
            onSubmit={handleSubmit(onSubmit)}
          >
            Submit
          </SubmitButton>
          {meetingCanUsersCreatePollEntries && (
            <Button
              color="primary"
              startIcon={<AddIcon />}
              onClick={() =>
                append({ startDate: new Date(), endDate: new Date() })
              }
            >
              Add Option
            </Button>
          )}
        </div>
      )}
    </form>
  );
};

export default MeetingPollForm;

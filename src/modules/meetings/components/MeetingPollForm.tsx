import React, { useEffect, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import format from 'date-fns/format';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import { useAppSelector, useAppDispatch } from 'src/hooks/redux';
import AddIcon from '@material-ui/icons/Add';
import {
  meetingsDatesPollEntriesSelector,
  meetingsMeetingDatesPollFormIdSelector,
  meetingsMeetingHasUserPollEntryAdditionsEnabled,
} from '../selectors';
import type { IMeetingDatesPollEntry } from '../reducer';
import { meetingsMeetingPollDatesResponseChangeRequest } from '../actions';
import classes from './MeetingPollForm.module.scss';
import { authCurrentUserIdSelector } from 'src/modules/auth/selectors';
import { Divider, IconButton } from '@material-ui/core';
import { differenceInMinutes, isAfter } from 'date-fns';
import { DateTimePicker } from '@material-ui/pickers';
import { omit } from 'lodash';
import DeleteIcon from '@material-ui/icons/Delete';
import { isMobileSelector } from 'src/modules/app/selectors';

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
      meetingsMeetingHasUserPollEntryAdditionsEnabled(
        state,
        meetingDatesPollFormId,
      ),
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
  });

  useEffect(() => {
    if (meetingDatesPollEntries.length) {
      setValue(
        'selections',
        meetingDatesPollEntries.map((value) => ({
          id: value.id,
          selected: value.userMeetingDatesPollEntries.some(
            (value) => value.user.id === currentUserId,
          ),
          count: value.userMeetingDatesPollEntries.length,
        })),
      );
    }
  }, [meetingDatesPollEntries]);

  const dispatch = useAppDispatch();

  const onSubmit = (formData: IMeetingPollForm) => {
    if (meetingDatesPollFormId) {
      dispatch(
        meetingsMeetingPollDatesResponseChangeRequest({
          votes: formData.selections.map((value) => ({
            [value.id]: value.selected,
          })),
          newMeetingDatesPollEntries: formData.newOptions,
          meetingId: meetingDatesPollFormId,
        }),
      );
    }
  };

  const isMobile = useAppSelector(isMobileSelector);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl component="fieldset">
        <FormGroup>
          {selections.map((entry, index) => {
            return (
              <>
                <FormControlLabel
                  key={entry.id}
                  control={
                    <Controller
                      name={`selections.${index}.selected` as const}
                      control={control}
                      render={(props) => (
                        <Checkbox
                          checked={props.field.value}
                          onChange={(e) =>
                            props.field.onChange(e.target.checked)
                          }
                        />
                      )}
                      defaultValue={entry.selected}
                    />
                  }
                  label={`${
                    meetingDatesPollEntriesMap[entry.id]
                      ? format(
                          new Date(
                            meetingDatesPollEntriesMap[entry.id].startDate,
                          ),
                          'yyyy-MM-dd HH:mm',
                        )
                      : ''
                  } - ${
                    meetingDatesPollEntriesMap[entry.id]
                      ? format(
                          new Date(
                            meetingDatesPollEntriesMap[entry.id].endDate,
                          ),
                          'yyyy-MM-dd HH:mm',
                        )
                      : ''
                  } (${entry.count})`}
                />
              </>
            );
          })}
        </FormGroup>
      </FormControl>
      {fields.map((item, index) => {
        return (
          <div className={classes.dateFields} key={item.id}>
            <Controller
              render={({ field }) => (
                <DateTimePicker
                  {...omit(field, 'ref')}
                  label="Start Date"
                  margin="dense"
                  disablePast
                  inputVariant="outlined"
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
                  helperText={
                    errors.newOptions?.[index]?.endDate?.type === 'validate'
                      ? 'End date must be after start date'
                      : undefined
                  }
                  error={!!errors.newOptions?.[index]?.endDate}
                  margin="dense"
                  label="End Date"
                  disablePast
                  inputVariant="outlined"
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
            <Divider className={classes.divider} />
            {isMobile && fields.length - 1 !== index && (
              <Divider className={classes.divider} />
            )}
          </div>
        );
      })}

      <div className={classes.submitContainer}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.submitButton}
        >
          Submit
        </Button>
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
    </form>
  );
};

export default MeetingPollForm;

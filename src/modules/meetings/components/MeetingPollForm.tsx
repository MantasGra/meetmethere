import React, { useEffect, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import format from 'date-fns/format';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import { useAppSelector, useAppDispatch } from 'src/hooks/redux';
import {
  meetingsDatesPollEntriesSelector,
  meetingsMeetingDatesPollFormIdSelector,
} from '../selectors';
import type { IMeetingDatesPollEntry } from '../reducer';
import { meetingsMeetingPollDatesResponseChangeRequest } from '../actions';
import classes from './MeetingPollForm.module.scss';
import { authCurrentUserIdSelector } from 'src/modules/auth/selectors';

interface IMeetingPollForm {
  selections: Array<{ id: number; selected: boolean; count: number }>;
  newOptions: Array<{ startDate: Date; endDate: Date }>;
}

const MeetingPollForm: React.FC = () => {
  const { control, setValue, handleSubmit } = useForm<IMeetingPollForm>();

  const meetingDatesPollFormId = useAppSelector(
    meetingsMeetingDatesPollFormIdSelector,
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
          meetingId: meetingDatesPollFormId,
        }),
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl component="fieldset">
        <FormGroup>
          {selections.map((entry, index) => {
            return (
              <FormControlLabel
                key={entry.id}
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
                        new Date(
                          meetingDatesPollEntriesMap[entry.id].startDate,
                        ),
                        'yyyy-MM-dd HH:mm',
                      )
                    : ''
                } - ${
                  meetingDatesPollEntriesMap[entry.id]
                    ? format(
                        new Date(meetingDatesPollEntriesMap[entry.id].endDate),
                        'yyyy-MM-dd HH:mm',
                      )
                    : ''
                } (${entry.count})`}
              />
            );
          })}
        </FormGroup>
      </FormControl>
      <div className={classes.submitContainer}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.submitButton}
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default MeetingPollForm;

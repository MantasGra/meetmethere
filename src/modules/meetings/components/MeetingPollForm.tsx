import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import format from 'date-fns/format';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { useAppSelector } from 'src/hooks/redux';
import {
  meetingsDatesPollEntriesSelector,
  meetingsMeetingDatesPollFormIdSelector,
} from '../selectors';

interface IMeetingPollForm {
  selections: Array<{ id: number; selected: boolean }>;
  newOptions: Array<{ startDate: Date; endDate: Date }>;
}

const MeetingPollForm: React.FC = () => {
  const { control } = useForm<IMeetingPollForm>();

  const meetingDatesPollFormId = useAppSelector(
    meetingsMeetingDatesPollFormIdSelector,
  );

  const meetingDatesPollEntries = useAppSelector((state) =>
    meetingDatesPollFormId
      ? meetingsDatesPollEntriesSelector(state, meetingDatesPollFormId)
      : [],
  );

  console.log(meetingDatesPollEntries);

  const { fields: selections } = useFieldArray({
    control,
    name: 'selections',
  });

  return (
    <form>
      <FormControl component="fieldset">
        <FormGroup>
          {meetingDatesPollEntries.map((entry) => {
            return (
              <FormControlLabel
                key={entry.id}
                control={<Checkbox checked={true} />}
                label={`${format(
                  new Date(entry.startDate),
                  'yyyy-MM-dd HH:mm',
                )} - ${format(new Date(entry.endDate), 'yyyy-MM-dd HH:mm')}`}
              />
            );
          })}
        </FormGroup>
      </FormControl>
    </form>
  );
};

export default MeetingPollForm;

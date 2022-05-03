import Chip from '@mui/material/Chip';

import { MeetingStatus } from '../reducer';

interface IMeetingStatusChipProps {
  meetingStatus: MeetingStatus;
}

export const MeetingStatusDisplayNames = Object.freeze({
  [MeetingStatus.Planned]: 'Planned',
  [MeetingStatus.Postponed]: 'Postponed',
  [MeetingStatus.Started]: 'Started',
  [MeetingStatus.Extended]: 'Extended',
  [MeetingStatus.Ended]: 'Ended',
  [MeetingStatus.Canceled]: 'Canceled',
});

const MeetingStatusDisplayColor = Object.freeze({
  [MeetingStatus.Planned]: '#388FE5',
  [MeetingStatus.Postponed]: '#F18701',
  [MeetingStatus.Started]: '#58BC82',
  [MeetingStatus.Extended]: '#3E442B',
  [MeetingStatus.Ended]: '#0B090B',
  [MeetingStatus.Canceled]: '#A30000',
});

const MeetingStatusChip: React.FC<IMeetingStatusChipProps> = ({
  meetingStatus,
}) => (
  <Chip
    label={MeetingStatusDisplayNames[meetingStatus]}
    style={{
      backgroundColor: MeetingStatusDisplayColor[meetingStatus],
      color: 'white',
    }}
  />
);

export default MeetingStatusChip;

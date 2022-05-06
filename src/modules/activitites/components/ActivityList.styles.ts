import { css } from '@emotion/react';

const activityList = css`
  width: 90%;
  overflow: auto;
`;

const activityListItem = css`
  justify-content: space-between;
  flex-wrap: wrap;
`;

const activityListItemText = css`
  flex-grow: 0;
  flex-shrink: 1;
`;

const activityListItemDates = css`
  flex-grow: 1;
  flex-shrink: 0;
  white-space: nowrap;
  text-align: right;
  margin-right: 70px;
`;

export default {
  activityList,
  activityListItem,
  activityListItemText,
  activityListItemDates,
};

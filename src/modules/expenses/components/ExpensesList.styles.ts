import { css } from '@emotion/react';

const expenseList = css`
  width: 90%;
  overflow: auto;
`;

const expenseListItem = css`
  margin: 10px 0;
`;

const expenseMembers = css`
  display: flex;
  align-items: center;
`;

const memberListAvatar = css`
  margin: 0 5px;
`;

export default {
  expenseList,
  expenseListItem,
  expenseMembers,
  memberListAvatar,
};

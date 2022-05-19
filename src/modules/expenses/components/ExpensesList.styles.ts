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

const expenseMemberAvatars = css`
  margin-left: 10px;
`;

const dividerSpacing = css`
  margin: 10px 0;
`;

export default {
  expenseList,
  expenseListItem,
  expenseMembers,
  expenseMemberAvatars,
  dividerSpacing,
};

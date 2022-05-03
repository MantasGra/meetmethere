import { css } from '@emotion/react';
import { darken } from 'polished';

const invitationsList = css`
  min-width: 500px;
  width: 80%;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  @media only screen and (max-width: 500px) {
    width: 90%;
    min-width: unset;
  }
`;

const invitationListItem = css`
  width: 100%;
  margin: 10px 0;
  background-color: rgb(250, 242, 208);

  &:hover {
    background-color: ${darken(0.1, 'rgb(250, 242, 208)')};
    cursor: pointer;
  }
`;

const invitationListItemContent = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .description {
    max-width: 70%;
    overflow-wrap: break-word;
  }
`;

export default {
  invitationsList,
  invitationListItem,
  invitationListItemContent,
};

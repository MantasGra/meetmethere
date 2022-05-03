import { css } from '@emotion/react';
import { darken } from 'polished';

const meetingList = css`
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

const meetingListItem = css`
  margin: 10px 0;
  width: 100%;
  background-color: rgb(208, 239, 250);

  &:hover {
    background-color: ${darken(0.2, 'rgb(208, 239, 250)')};
    cursor: pointer;
  }
`;

const meetingListItemHistorical = css`
  margin: 10px 0;
  width: 100%;
  background-color: rgb(206, 219, 240);

  &:hover {
    background-color: ${darken(0.2, 'rgb(206, 219, 240)')};
    cursor: pointer;
  }
`;

const meetingListItemContent = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const description = css`
  max-width: 70%;
  overflow-wrap: break-word;
`;

const meetingListItemAvatars = css`
  display: flex;
  flex-direction: row-reverse;
`;

const listItemAvatar = css`
  &:not(:first-child) {
    margin-right: -20px;
  }
`;

const loading = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default {
  meetingList,
  meetingListItem,
  meetingListItemHistorical,
  meetingListItemContent,
  description,
  meetingListItemAvatars,
  listItemAvatar,
  loading,
};

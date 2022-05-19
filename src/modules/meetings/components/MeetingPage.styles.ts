import { css } from '@emotion/react';

const meetingPageContainer = css`
  width: 95%;
  height: calc(95% - 64px);
  margin: 20px auto 10px;
  background-color: rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    height: unset;
  }
`;

const loading = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const tabContainer = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  min-height: 0;
`;

const tabContent = css`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  min-height: 0;
`;

const addButtonContainer = css`
  height: 50px;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
`;

const addButtonContainerWithContent = css`
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  & > * {
    margin: 5px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
  }
`;

const addButton = css`
  margin-right: 20px;
  height: 36px;
`;

export default {
  meetingPageContainer,
  loading,
  tabContainer,
  tabContent,
  addButtonContainer,
  addButtonContainerWithContent,
  addButton,
};

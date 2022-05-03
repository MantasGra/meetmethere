import { css } from '@emotion/react';

const dateFields = css`
  width: 600px;
  display: flex;
  justify-content: space-between;

  @media only screen and (max-width: 768px) {
    width: 100%;
    flex-direction: column;
  }
`;

const divider = css`
  margin-top: 10px;
`;

const pollActionsRow = css`
  text-align: right;
`;

const submitContainer = css`
  text-align: right;
`;

const submitButton = css`
  margin: 10px 0;
`;

export default {
  dateFields,
  divider,
  pollActionsRow,
  submitContainer,
  submitButton,
};

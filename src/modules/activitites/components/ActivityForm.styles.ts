import { css } from '@emotion/react';

const submitContainer = css`
  text-align: right;
`;

const submitButton = css`
  margin: 10px 0;
`;

const helperTextRight = css`
  text-align: right;
`;

const dateFields = css`
  width: 600px;
  display: flex;
  justify-content: space-between;

  @media only screen and (max-width: 768px) {
    width: 100%;
    flex-direction: column;
  }
`;

export default { submitContainer, submitButton, helperTextRight, dateFields };

import { css } from '@emotion/react';

const submitContainer = css`
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
`;

const submitButton = css`
  margin: 10px 0;
`;

const divider = css`
  margin-top: 10px;
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

export default { submitContainer, submitButton, divider, dateFields };

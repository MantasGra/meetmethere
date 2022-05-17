import { css } from '@emotion/react';

const container = css`
  width: 80%;
  max-width: 500px;
  margin: auto;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

const icon = css`
  width: 100%;
  height: auto;
  max-height: 100%;
  flex: 1;
  min-height: 0;
`;

const text = css`
  margin-top: 20px;
`;

export default { container, icon, text };

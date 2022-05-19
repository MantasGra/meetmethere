import { css } from '@emotion/react';

const container = css`
  width: 80%;
  max-width: 500px;
  margin: auto;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-height: 0;
`;

const icon = css`
  width: calc(100% - 20px);
  height: auto;
  max-height: 100%;
  flex: 1;
  min-height: 0;
`;

const text = css`
  padding: 20px;
`;

export default { container, icon, text };

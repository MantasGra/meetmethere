import { css } from '@emotion/react';

const App = css`
  display: flex;
  height: 100%;
`;

const Content = css`
  flex-grow: 1;
  max-width: calc(100% - 240px);

  @media only screen and (max-width: 768px) {
    max-width: 100%;
    height: unset;
  }
`;

export default { App, Content };

import { css } from '@emotion/react';

const App = css`
  display: flex;
  height: 100%;
  overflow: hidden;
`;

const content = (fullWidth: boolean) => css`
  flex-grow: 1;
  margin-top: 64px;
  max-width: ${fullWidth ? '100%' : 'calc(100% - 240px)'};
  overflow: auto;

  @media only screen and (max-width: 768px) {
    max-width: 100%;
    height: unset;
  }
`;

const homePageIcon = css`
  padding-top: 30px;
`;

export default { App, content, homePageIcon };

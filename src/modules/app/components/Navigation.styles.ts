import { css } from '@emotion/react';

const drawer = css`
  width: 240px;
  flex-shrink: 0;
`;

const drawerPaper = css`
  width: 240px;
`;

const drawerContainer = css`
  overflow: auto;
  margin-top: 64px;
`;

export default { drawer, drawerPaper, drawerContainer };

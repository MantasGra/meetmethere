import type { BrowserHistory } from 'history';
import { useState, useLayoutEffect } from 'react';
import { Router, BrowserRouterProps } from 'react-router-dom';

interface HistoryInjectableBrowserRouterProps extends BrowserRouterProps {
  history: BrowserHistory;
}

const HistoryInjectableBrowserRouter: React.FC<
  HistoryInjectableBrowserRouterProps
> = (props) => {
  const { history, ...rest } = props;
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      {...rest}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
};

export default HistoryInjectableBrowserRouter;

import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { StylesProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import store from 'src/modules/app/store';
import history from 'src/modules/app/history';

import App from 'src/modules/app/components/App';
import './index.css';

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <StylesProvider injectFirst>
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      </StylesProvider>
    </Router>
  </Provider>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}

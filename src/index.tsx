import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { Wrapper } from '@googlemaps/react-wrapper';
import { StylesProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { SnackbarProvider } from 'notistack';
import store from 'src/modules/app/store';
import history from 'src/modules/app/history';

import App from 'src/modules/app/components/App';
import './index.css';

ReactDOM.render(
  <Wrapper
    apiKey={import.meta.env.SNOWPACK_PUBLIC_GOOGLE_API_KEY}
    libraries={['places']}
    version="quarterly"
  >
    <Provider store={store}>
      <Router history={history}>
        <StylesProvider injectFirst>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <SnackbarProvider>
              <App />
            </SnackbarProvider>
          </MuiPickersUtilsProvider>
        </StylesProvider>
      </Router>
    </Provider>
  </Wrapper>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}

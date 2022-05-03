import { Wrapper } from '@googlemaps/react-wrapper';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { SnackbarProvider } from 'notistack';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from 'src/modules/app/components/App';
import history from 'src/modules/app/history';
import store from 'src/modules/app/store';

import HistoryInjectableBrowserRouter from './components/Router/HistoryInjectableBrowserRouter';

import './index.css';

const container = document.getElementById('root');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <StrictMode>
    <Wrapper
      apiKey={import.meta.env.SNOWPACK_PUBLIC_GOOGLE_API_KEY}
      libraries={['places']}
      version="quarterly"
    >
      <Provider store={store}>
        <HistoryInjectableBrowserRouter history={history}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <SnackbarProvider>
              <App />
            </SnackbarProvider>
          </LocalizationProvider>
        </HistoryInjectableBrowserRouter>
      </Provider>
    </Wrapper>
  </StrictMode>,
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}

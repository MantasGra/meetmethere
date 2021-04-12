import { configureStore } from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';
import type { EpicMiddleware } from 'redux-observable';
import { responsiveStoreEnhancer } from 'redux-responsive';
import Axios from 'axios-observable';
import rootReducer from './reducer';
import type { RootState } from './reducer';
import rootEpic from './epics';
import history from './history';
import getConfig from 'src/config/config';
import { AppActions, appInit } from './actions';

const configureAppStore = (preloadedState?: RootState) => {
  const config = getConfig();
  const axiosInstance = Axios.create({
    baseURL: config.backendBaseUrl,
    timeout: 1000,
  });
  const epicMiddleware: EpicMiddleware<
    AppActions,
    AppActions,
    RootState,
    AppDeps
  > = createEpicMiddleware({
    dependencies: {
      history,
      axios: axiosInstance,
    },
  });
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(epicMiddleware),
    devTools: true,
    preloadedState,
    enhancers: [responsiveStoreEnhancer],
  });

  epicMiddleware.run(rootEpic);

  return store;
};

const appStore = configureAppStore();

appStore.dispatch(appInit());

export type AppDeps = {
  history: typeof history;
  axios: Axios;
};
export type AppDispatch = typeof appStore.dispatch;
export default appStore;

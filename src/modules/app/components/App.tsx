import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { CircularProgress, Toolbar } from '@material-ui/core';

import ProtectedRoute from 'src/components/ProtectedRoute';
import LoginPage from 'src/modules/auth/components/LoginPage';
import RegisterPage from 'src/modules/auth/components/RegisterPage';
import Notifier from 'src/modules/snackbars/components/Notifier';
import {
  authLoadingSelector,
  isUserLoggedInSelector,
} from 'src/modules/auth/selectors';
import { Routes } from 'src/constants/enums';
import AppBar from './AppBar';
import Dialogs from './Dialogs';
import PlannedMeetingList from 'src/modules/meetings/components/PlannedMeetingList';
import HistoricMeetingList from 'src/modules/meetings/components/HistoricMeetingList';
import MeetingPage from 'src/modules/meetings/components/MeetingPage';
import { useAppSelector } from 'src/hooks/redux';
import ComingSoon from 'src/components/ComingSoon';
import { isAppInitializedSelector } from '../selectors';
import Navigation from './Navigation';
import classes from './App.module.scss';

const App: React.FC = () => {
  const isAuthLoading = useAppSelector(authLoadingSelector);
  const isAppInitialized = useAppSelector(isAppInitializedSelector);
  const isLoggedIn = useAppSelector(isUserLoggedInSelector);
  if (!isAppInitialized) {
    return <CircularProgress />;
  }
  return (
    <div className={classes.App}>
      <Notifier />
      <Dialogs />
      <AppBar />
      {isLoggedIn && <Navigation />}
      <main className={classes.Content}>
        <Toolbar />
        <Switch>
          <ProtectedRoute
            path={Routes.Login}
            exact
            loading={isAuthLoading}
            guardSelector={(state) => !isUserLoggedInSelector(state)}
          >
            <LoginPage />
          </ProtectedRoute>
          <ProtectedRoute
            path={Routes.Register}
            exact
            loading={isAuthLoading}
            guardSelector={(state) => !isUserLoggedInSelector(state)}
          >
            <RegisterPage />
          </ProtectedRoute>
          <ProtectedRoute
            path={Routes.Meetings}
            exact
            loading={isAuthLoading}
            guardSelector={isUserLoggedInSelector}
          >
            <PlannedMeetingList />
          </ProtectedRoute>
          <ProtectedRoute
            path={Routes.MeetingPage}
            exact
            loading={isAuthLoading}
            guardSelector={isUserLoggedInSelector}
          >
            <MeetingPage />
          </ProtectedRoute>
          <ProtectedRoute
            path={Routes.History}
            exact
            loading={isAuthLoading}
            guardSelector={isUserLoggedInSelector}
          >
            <HistoricMeetingList />
          </ProtectedRoute>
          <ProtectedRoute
            path={Routes.Invitations}
            exact
            loading={isAuthLoading}
            guardSelector={isUserLoggedInSelector}
          >
            <ComingSoon />
          </ProtectedRoute>
          <Route path={Routes.Home}>
            {isLoggedIn && <Redirect to={Routes.Meetings} />}
          </Route>
        </Switch>
      </main>
    </div>
  );
};

export default App;

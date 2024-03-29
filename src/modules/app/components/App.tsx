import { CircularProgress } from '@mui/material';
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
} from '@mui/material/styles';
import { Fragment } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import GuardedComponent from 'src/components/Router/GuardedComponent';
import iconClasses from 'src/components/StatusIcons/StatusIcon.styles';
import { Routes as AppRoutes } from 'src/constants/enums';
import { useAppSelector } from 'src/hooks/redux';
import { MeetingIcon } from 'src/icons';
import LoginPage from 'src/modules/auth/components/LoginPage';
import RegisterPage from 'src/modules/auth/components/RegisterPage';
import RequestPasswordResetPage from 'src/modules/auth/components/RequestPasswordResetPage';
import ResetPasswordPage from 'src/modules/auth/components/ResetPasswordPage';
import {
  authLoadingSelector,
  isUserLoggedInSelector,
} from 'src/modules/auth/selectors';
import InvitationsList from 'src/modules/invitations/components/InvitationsList';
import MeetingList from 'src/modules/meetings/components/MeetingList';
import MeetingPage from 'src/modules/meetings/components/MeetingPage';
import PlannedMeetingList from 'src/modules/meetings/components/PlannedMeetingList';
import { MeetingTypes } from 'src/modules/meetings/reducer';
import Notifier from 'src/modules/snackbars/components/Notifier';

import { isAppInitializedSelector } from '../selectors';

import classes from './App.styles';
import AppBar from './AppBar';
import Dialogs from './Dialogs';
import Navigation from './Navigation';

const theme = createTheme({
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          wordBreak: 'break-word',
        },
      },
    },
  },
});

const App: React.FC = () => {
  const isAuthLoading = useAppSelector(authLoadingSelector);
  const isAppInitialized = useAppSelector(isAppInitializedSelector);
  const isLoggedIn = useAppSelector(isUserLoggedInSelector);
  if (!isAppInitialized) {
    return <CircularProgress />;
  }
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <div css={classes.App}>
          <Notifier />
          <Dialogs />
          <AppBar />
          {isLoggedIn && <Navigation />}
          <main css={classes.content(!isLoggedIn)}>
            <Routes>
              <Route
                path={AppRoutes.Login}
                element={
                  <GuardedComponent
                    loading={isAuthLoading}
                    guardSelector={(state) => !isUserLoggedInSelector(state)}
                  >
                    <LoginPage />
                  </GuardedComponent>
                }
              />
              <Route
                path={AppRoutes.Register}
                element={
                  <GuardedComponent
                    loading={isAuthLoading}
                    guardSelector={(state) => !isUserLoggedInSelector(state)}
                  >
                    <RegisterPage />
                  </GuardedComponent>
                }
              />
              <Route
                path={AppRoutes.RequestPasswordReset}
                element={
                  <GuardedComponent
                    loading={isAuthLoading}
                    guardSelector={(state) => !isUserLoggedInSelector(state)}
                  >
                    <RequestPasswordResetPage />
                  </GuardedComponent>
                }
              />
              <Route
                path={AppRoutes.ResetPassword}
                element={
                  <GuardedComponent
                    loading={isAuthLoading}
                    guardSelector={(state) => !isUserLoggedInSelector(state)}
                  >
                    <ResetPasswordPage />
                  </GuardedComponent>
                }
              />
              <Route
                path={AppRoutes.Meetings}
                element={
                  <GuardedComponent
                    loading={isAuthLoading}
                    guardSelector={isUserLoggedInSelector}
                  >
                    <PlannedMeetingList />
                  </GuardedComponent>
                }
              />
              <Route
                path={AppRoutes.MeetingPage}
                element={
                  <GuardedComponent
                    loading={isAuthLoading}
                    guardSelector={isUserLoggedInSelector}
                  >
                    <MeetingPage />
                  </GuardedComponent>
                }
              />
              <Route
                path={AppRoutes.History}
                element={
                  <GuardedComponent
                    loading={isAuthLoading}
                    guardSelector={isUserLoggedInSelector}
                  >
                    <MeetingList typeOfMeeting={MeetingTypes.Archived} />
                  </GuardedComponent>
                }
              />
              <Route
                path={AppRoutes.Invitations}
                element={
                  <GuardedComponent
                    loading={isAuthLoading}
                    guardSelector={isUserLoggedInSelector}
                  >
                    <InvitationsList />
                  </GuardedComponent>
                }
              />
              <Route
                path={AppRoutes.Home}
                element={
                  <Fragment>
                    {isLoggedIn && <Navigate to={AppRoutes.Meetings} replace />}
                    <div css={[iconClasses.container, classes.homePageIcon]}>
                      <MeetingIcon css={iconClasses.icon} />
                    </div>
                  </Fragment>
                }
              ></Route>
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;

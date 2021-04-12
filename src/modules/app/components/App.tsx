import React from 'react';
import { Switch, Route } from 'react-router-dom';

import ProtectedRoute from 'src/components/ProtectedRoute';
import LoginPage from 'src/modules/auth/components/LoginPage';
import RegisterPage from 'src/modules/auth/components/RegisterPage';
import Notifier from 'src/modules/snackbars/components/Notifier';
import { isUserLoggedInSelector } from 'src/modules/auth/selectors';
import { Routes } from 'src/constants/enums';
import AppBar from './AppBar';
import Dialogs from './Dialogs';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <Notifier />
      <Dialogs />
      <AppBar />
      <Switch>
        <ProtectedRoute
          path={Routes.Login}
          exact
          guardSelector={(state) => !isUserLoggedInSelector(state)}
        >
          <LoginPage />
        </ProtectedRoute>
        <ProtectedRoute
          path={Routes.Register}
          exact
          guardSelector={(state) => !isUserLoggedInSelector(state)}
        >
          <RegisterPage />
        </ProtectedRoute>
        <Route path={Routes.Home} />
      </Switch>
    </div>
  );
};

export default App;

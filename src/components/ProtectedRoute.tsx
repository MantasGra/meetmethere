import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import { Routes } from 'src/constants/enums';
import { useAppSelector } from 'src/hooks/redux';
import type { RootState } from 'src/modules/app/reducer';

interface IProtectedRouteProps extends RouteProps {
  guardSelector?: (state: RootState) => boolean;
  guard?: boolean;
  fallsbackTo?: Routes;
  loading?: boolean;
  SuspenseComponent?: React.ReactNode;
}

const ProtectedRoute: React.FC<IProtectedRouteProps> = ({
  guardSelector = () => true,
  guard = true,
  fallsbackTo = Routes.Home,
  children,
  loading = false,
  SuspenseComponent = <CircularProgress />,
  ...rest
}) => {
  const stateGuard = useAppSelector(guardSelector);
  const shouldRedirect = !stateGuard || !guard;
  return loading ? (
    <>{SuspenseComponent}</>
  ) : (
    <Route {...rest}>
      {shouldRedirect ? <Redirect to={fallsbackTo} /> : children}
    </Route>
  );
};

export default ProtectedRoute;

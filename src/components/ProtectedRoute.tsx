import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import { Routes } from 'src/constants/enums';
import { useAppSelector } from 'src/hooks/redux';
import type { RootState } from 'src/modules/app/reducer';

interface IProtectedRouteProps extends RouteProps {
  guardSelector?: (state: RootState) => boolean;
  guard?: boolean;
  fallsbackTo?: Routes;
}

const ProtectedRoute: React.FC<IProtectedRouteProps> = ({
  guardSelector = () => true,
  guard = true,
  fallsbackTo = Routes.Home,
  children,
  ...rest
}) => {
  const stateGuard = useAppSelector(guardSelector);
  const shouldRedirect = !stateGuard || !guard;
  return (
    <Route {...rest}>
      {shouldRedirect ? <Redirect to={fallsbackTo} /> : children}
    </Route>
  );
};

export default ProtectedRoute;

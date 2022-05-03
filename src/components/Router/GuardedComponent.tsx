import CircularProgress from '@mui/material/CircularProgress';
import { Fragment } from 'react';
import { Navigate } from 'react-router-dom';
import { Routes } from 'src/constants/enums';
import { useAppSelector } from 'src/hooks/redux';
import type { RootState } from 'src/modules/app/reducer';

interface IGuardedComponentProps {
  guardSelector?: (state: RootState) => boolean;
  guard?: boolean;
  fallsbackTo?: Routes;
  loading?: boolean;
  SuspenseComponent?: React.ReactNode;
  children: React.ReactNode;
}

const GuardedComponent: React.FC<IGuardedComponentProps> = ({
  guardSelector = () => true,
  guard = true,
  fallsbackTo = Routes.Home,
  children,
  loading = false,
  SuspenseComponent = <CircularProgress />,
}) => {
  const stateGuard = useAppSelector(guardSelector);
  const shouldRedirect = !stateGuard || !guard;
  return loading ? (
    <Fragment>{SuspenseComponent}</Fragment>
  ) : (
    <Fragment>
      {shouldRedirect ? <Navigate to={fallsbackTo} replace /> : children}
    </Fragment>
  );
};

export default GuardedComponent;

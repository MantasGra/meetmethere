import { useLocation, matchPath } from 'react-router';
import type { Routes } from 'src/constants/enums';

export const useMatchRoutes = (...routes: Routes[]): boolean => {
  const location = useLocation();
  return routes.some((value) => matchPath(location.pathname, value));
};

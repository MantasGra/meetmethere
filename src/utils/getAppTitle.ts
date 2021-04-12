import { matchPath } from 'react-router';
import { Routes } from 'src/constants/enums';

const getAppTitle = (pathName: string): string => {
  if (matchPath(pathName, { path: Routes.Login, exact: true })) {
    return 'Login';
  }
  if (matchPath(pathName, { path: Routes.Register, exact: true })) {
    return 'Register';
  }
  return 'MeetMeThere';
};

export default getAppTitle;

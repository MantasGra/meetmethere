import { matchPath } from 'react-router';
import { Routes } from 'src/constants/enums';

const getAppTitle = (pathName: string): string => {
  if (matchPath(pathName, Routes.Login)) {
    return 'Login';
  }
  if (matchPath(pathName, Routes.Register)) {
    return 'Register';
  }
  return 'MeetMeThere';
};

export default getAppTitle;

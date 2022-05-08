import { matchPath } from 'react-router';
import { Routes } from 'src/constants/enums';

const getAppTitle = (pathName: string): string => {
  if (matchPath(pathName, Routes.Login)) {
    return 'Login';
  }
  if (matchPath(pathName, Routes.Register)) {
    return 'Register';
  }
  if (matchPath(pathName, Routes.RequestPasswordReset)) {
    return 'Request password reset';
  }
  if (matchPath(pathName, Routes.ResetPassword)) {
    return 'Reset password';
  }
  return 'MeetMeThere';
};

export default getAppTitle;

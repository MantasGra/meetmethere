import type {
  Action,
  PayloadActionCreator,
  ActionCreatorWithPreparedPayload,
} from '@reduxjs/toolkit';
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import type Axios from 'axios-observable';
import { OperatorFunction, Observable, throwError } from 'rxjs';
import { filter, catchError, mergeMap } from 'rxjs/operators';
import StatusCodes from 'http-status-codes';
import { multipleActionsMatcher } from 'src/modules/app/actions';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const ofActionType = <
  PAC extends
    | PayloadActionCreator<any>
    | ActionCreatorWithPreparedPayload<any[], any>
>(
  actions: PAC | PAC[],
): OperatorFunction<Action<unknown>, ReturnType<PAC>> => {
  if (!Array.isArray(actions)) {
    actions = [actions];
  }
  return filter(multipleActionsMatcher(actions));
};
/* eslint-enable @typescript-eslint/no-explicit-any */

interface IExpiredTokenResponse {
  message: string;
  expired: boolean;
}

export const fromAxios = <T>(
  axiosInstance: Axios,
  config: AxiosRequestConfig,
): Observable<AxiosResponse<T>> => {
  return axiosInstance.request<T>(config).pipe(
    catchError((error: AxiosError<T>) => {
      if (
        error.response?.status === StatusCodes.FORBIDDEN &&
        ((error.response?.data as unknown) as IExpiredTokenResponse)
          ?.expired === true
      ) {
        return axiosInstance
          .request({
            url: '/auth/token',
            withCredentials: true,
          })
          .pipe(mergeMap(() => axiosInstance.request<T>(config)));
      }
      return throwError(error);
    }),
  );
};

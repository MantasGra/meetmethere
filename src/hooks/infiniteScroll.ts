import type { ActionCreatorWithoutPayload, Action } from '@reduxjs/toolkit';
import { useRef, useCallback, useState, useEffect } from 'react';
import type { AppSelector } from 'src/modules/app/reducer';

import { useAppDispatch, useAppSelector } from './redux';

interface InfiniteScrollHookReturn<T, E> {
  loading: boolean;
  list: T[];
  error: E;
  lastElementRef: (node: Element | null) => void;
}

export const useInfiniteScroll = <T, E, P>(
  isLoadingSelector: AppSelector<boolean>,
  hasMoreSelector: AppSelector<boolean>,
  listSelector: AppSelector<T[]>,
  fetchErrorSelector: AppSelector<E>,
  fetchAction: (page: number) => Action<P>,
  cancelAction?: ActionCreatorWithoutPayload,
): InfiniteScrollHookReturn<T, E> => {
  const loading = useAppSelector(isLoadingSelector);
  const hasMore = useAppSelector(hasMoreSelector);
  const list = useAppSelector(listSelector);
  const error = useAppSelector(fetchErrorSelector);
  const [pageNumber, setPageNumber] = useState(1);

  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useCallback(
    (node: Element | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAction(pageNumber));
    return () => {
      if (cancelAction) {
        dispatch(cancelAction());
      }
    };
  }, [pageNumber, fetchAction, cancelAction, dispatch]);

  return { loading, error, list, lastElementRef };
};

import { useRef, useCallback, useState, useEffect } from 'react';
import type { AppSelector } from 'src/modules/app/reducer';
import type {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPreparedPayload,
} from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from './redux';

interface InfiniteScrollHookReturn<T, E> {
  loading: boolean;
  list: T[];
  error: E;
  lastElementRef: (node: Element) => void;
}

export const useInfiniteScroll = <T, E>(
  isLoadingSelector: AppSelector<boolean>,
  hasMoreSelector: AppSelector<boolean>,
  listSelector: AppSelector<T[]>,
  fetchErrorSelector: AppSelector<E>,
  fetchAction: ActionCreatorWithPreparedPayload<[number], { page: number }>,
  cancelAction?: ActionCreatorWithoutPayload,
): InfiniteScrollHookReturn<T, E> => {
  const loading = useAppSelector(isLoadingSelector);
  const hasMore = useAppSelector(hasMoreSelector);
  const list = useAppSelector(listSelector);
  const error = useAppSelector(fetchErrorSelector);
  const [pageNumber, setPageNumber] = useState(1);

  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useCallback(
    (node: Element) => {
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
  }, [pageNumber]);

  return { loading, error, list, lastElementRef };
};

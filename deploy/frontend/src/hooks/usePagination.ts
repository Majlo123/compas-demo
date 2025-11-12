import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import { PAGE_SIZES } from '@/types/query/QueryPagination';

export const PAGE_PARAM = 'page';
export const PAGE_SIZE_PARAM = 'pageSize';

/**
 * ⚠️ The `onChange` param must be stable to avoid unnecessary re-renders.
 * Consider memoizing it with `useCallback`.
 */
const usePagination = (
  onChange?: (page: number, pageSize: number) => void
): {
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
} => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get(PAGE_PARAM)) || 1;
  const pageSize = Number(searchParams.get(PAGE_SIZE_PARAM)) || 10;

  const setPage = useCallback(
    (newPage: number) => {
      if (newPage === page || newPage < 1) {
        return;
      }

      const newParams = new URLSearchParams(window.location.search);
      if (newPage === 1) {
        newParams.delete(PAGE_PARAM);
      } else {
        newParams.set(PAGE_PARAM, newPage.toString());
      }

      setSearchParams(newParams);
      if (onChange) {
        onChange(newPage, pageSize);
      }
    },
    [page, pageSize, setSearchParams, onChange]
  );

  const setPageSize = useCallback(
    (newPageSize: number) => {
      if (!PAGE_SIZES.includes(newPageSize as (typeof PAGE_SIZES)[number])) {
        return;
      }

      const newParams = new URLSearchParams(window.location.search);
      newParams.set(PAGE_SIZE_PARAM, newPageSize.toString());

      setSearchParams(newParams);
      setPage(1);

      if (onChange) {
        onChange(1, newPageSize);
      }
    },
    [page, pageSize, setSearchParams, setPage, searchParams]
  );

  return { page, setPage, pageSize, setPageSize } as const;
};

export default usePagination;

import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import QuerySort, { SORT_DIRECTION } from '@/types/query/QuerySort';

export const SORT_BY_PARAM = 'by';
export const SORT_DIRECTION_PARAM = 'direction';

const getNextDirection = (
  sort: QuerySort,
  column: string
): QuerySort['direction'] => {
  const isSameColumn = column === sort.by;

  if (!isSameColumn) {
    return SORT_DIRECTION.ASC;
  }

  if (sort.direction === SORT_DIRECTION.ASC) {
    return SORT_DIRECTION.DESC;
  }
  return null;
};

/**
 * ⚠️ The `onChange` param must be stable to avoid unnecessary re-renders.
 * Consider memoizing it with `useCallback`.
 */
const useSort = (
  onChange?: (sort: QuerySort) => void
): { sort: QuerySort; setSort: (column: string) => void } => {
  const [searchParams, setSearchParams] = useSearchParams();

  const sort = {
    by: searchParams.get(SORT_BY_PARAM),
    direction:
      (searchParams.get(SORT_DIRECTION_PARAM) as QuerySort['direction']) ||
      'asc',
  };

  const setSort = useCallback(
    (column: string) => {
      const newParams = new URLSearchParams(window.location.search);
      const nextDirection = getNextDirection(sort, column);
      const nextColumn = nextDirection ? column : null;

      if (nextDirection === null) {
        newParams.delete(SORT_BY_PARAM);
        newParams.delete(SORT_DIRECTION_PARAM);
      } else {
        newParams.set(SORT_BY_PARAM, nextColumn);
        newParams.set(SORT_DIRECTION_PARAM, nextDirection);
      }

      setSearchParams(newParams);
      if (onChange) {
        const newSort: QuerySort = { by: nextColumn, direction: nextDirection };
        onChange(newSort);
      }
    },
    [sort.by, sort.direction, onChange, searchParams]
  );

  return { sort, setSort } as const;
};

export default useSort;

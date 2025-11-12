import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import QueryFilter, { FilterOperator } from '@/types/query/QueryFilters';

export const FILTER_PARAM = 'filter';

const parseFilters = (raw: string): QueryFilter[] => {
  if (!raw) return [] as QueryFilter[];
  try {
    return JSON.parse(raw);
  } catch {
    return [] as QueryFilter[];
  }
};

const useFilter = (
  onChange?: (filters: QueryFilter[]) => void
): {
  filters: QueryFilter[];
  addFilter: (
    filterKey: string,
    operator: FilterOperator,
    value: string | number | boolean
  ) => void;
  removeFilter: (filterKey: string) => void;
  clearFilters: () => void;
} => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawFilters = searchParams.get(FILTER_PARAM);
  const filters = parseFilters(rawFilters);

  const addFilter = useCallback(
    (
      filterKey: string,
      operator: FilterOperator,
      value: string | number | boolean
    ) => {
      const newFilters = filters.filter((f) => f.filterKey !== filterKey);
      const isEmpty = value === '' || value === null || value === undefined;

      if (!isEmpty) {
        newFilters.push({ filterKey, operator, value } as QueryFilter);
      }

      const newParams = new URLSearchParams(window.location.search);
      if (newFilters.length > 0) {
        newParams.set(FILTER_PARAM, JSON.stringify(newFilters));
      } else {
        newParams.delete(FILTER_PARAM);
      }

      setSearchParams(newParams);
      onChange?.(newFilters);
    },
    [filters, searchParams, setSearchParams, onChange]
  );

  const removeFilter = useCallback(
    (filterKey: string) => {
      const newFilters = filters.filter((f) => f.filterKey !== filterKey);
      const newParams = new URLSearchParams(window.location.search);

      if (newFilters.length > 0) {
        newParams.set(FILTER_PARAM, JSON.stringify(newFilters));
      } else {
        newParams.delete(FILTER_PARAM);
      }

      setSearchParams(newParams);
      onChange?.(newFilters);
    },
    [filters, searchParams, setSearchParams, onChange]
  );

  const clearFilters = useCallback(() => {
    const newParams = new URLSearchParams(window.location.search);
    newParams.delete(FILTER_PARAM);
    setSearchParams(newParams);
    onChange?.([]);
  }, [searchParams, setSearchParams, onChange]);

  return { filters, addFilter, removeFilter, clearFilters };
};

export default useFilter;

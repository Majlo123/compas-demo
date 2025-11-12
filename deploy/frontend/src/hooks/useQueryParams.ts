import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { FILTER_PARAM } from '@/hooks/useFilter';
import { PAGE_PARAM, PAGE_SIZE_PARAM } from '@/hooks/usePagination';
import { SORT_BY_PARAM, SORT_DIRECTION_PARAM } from '@/hooks/useSort';

const useQueryParams = (): { [key: string]: any } => {
  const [searchParams] = useSearchParams();

  const preparedParams = useMemo(() => {
    const page = searchParams.get(PAGE_PARAM) || 1;
    const pageSize = searchParams.get(PAGE_SIZE_PARAM) || 10;

    const by = searchParams.get(SORT_BY_PARAM);
    const direction = searchParams.get(SORT_DIRECTION_PARAM);

    const filter = searchParams.get(FILTER_PARAM);

    return {
      page,
      pageSize,
      by,
      direction,
      filter,
    };
  }, [searchParams]);

  return preparedParams;
};

export default useQueryParams;

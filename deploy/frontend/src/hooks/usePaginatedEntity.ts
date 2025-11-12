import { useEffect, useState } from 'react';

import { PaginatedApiResponse, PaginatedContent } from '@/api/shared.types';
import useQueryParams from '@/hooks/useQueryParams';

type PaginatedEntityHookState<T> = {
  isLoading: boolean;
  response: PaginatedApiResponse<T> | null;
  data: T[];
  totalPages: number;
  fetch: () => Promise<void>;
};

// Note this needs to be regular function, not a generic arrow function becouse of eslint problem
// This is maybe bug on eslint side, but for now this is the solution
function usePaginatedEntity<T>(
  apiFunction: (params: any) => Promise<PaginatedApiResponse<T>>,
  onSuccess?: (data: PaginatedContent<T>) => void,
  onError?: () => void
): PaginatedEntityHookState<T> {
  const queryParams = useQueryParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [response, setResponse] = useState<PaginatedApiResponse<T> | null>(
    null
  );

  const fetch = async (): Promise<void> => {
    const apiResponse = await apiFunction(queryParams);
    setResponse(apiResponse);
    if (apiResponse.success) {
      onSuccess?.(apiResponse.content);
    } else {
      onError?.();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    fetch();
  }, [queryParams]);

  const data = response?.success ? response.content.data : [];
  const totalPages = response?.success ? response.content.totalPages : 0;
  return {
    isLoading,
    response,
    data,
    fetch,
    totalPages,
  };
}

export default usePaginatedEntity;

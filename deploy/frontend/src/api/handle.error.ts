import type { ApiErrorResponse } from '@/api/shared.types';

export const getErrorMessage = (
  err: unknown,
  fallback = 'An unknown error occurred'
): string => {
  // Check for axios error response with backend error message
  if (
    typeof err === 'object' &&
    err &&
    'response' in err &&
    typeof err.response === 'object' &&
    err.response &&
    'data' in err.response &&
    typeof err.response.data === 'object' &&
    err.response.data &&
    'error' in err.response.data &&
    typeof err.response.data.error === 'object' &&
    err.response.data.error &&
    'message' in err.response.data.error &&
    typeof err.response.data.error.message === 'string'
  ) {
    return err.response.data.error.message;
  }
  
  if (err instanceof Error && err.message) {
    return err.message;
  }
  if (
    typeof err === 'object' &&
    err &&
    'message' in err &&
    typeof err.message === 'string'
  ) {
    return err.message;
  }
  return fallback;
};

export const formatError = (error: unknown): ApiErrorResponse => {
  // Check if this is an axios response object with backend error format
  if (
    typeof error === 'object' &&
    error &&
    'data' in error &&
    typeof error.data === 'object' &&
    error.data &&
    'success' in error.data &&
    error.data.success === false &&
    'error' in error.data
  ) {
    // Return the backend error response as-is
    return error.data as ApiErrorResponse;
  }
  
  return {
    success: false,
    error: {
      code: 500,
      message: getErrorMessage(error, 'Unexpected error, please try again'),
    },
  };
};

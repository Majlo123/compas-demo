import type { ApiErrorResponse } from '@/api/shared.types';

export const getErrorMessage = (
  err: unknown,
  fallback = 'An unknown error occurred'
): string => {
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
  return {
    success: false,
    error: {
      code: 500,
      message: getErrorMessage(error, 'Unexpected error, please try again'),
    },
  };
};

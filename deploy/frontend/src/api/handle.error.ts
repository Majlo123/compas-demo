import { isAxiosError } from 'axios';
import type { ApiErrorResponse } from '@/api/shared.types';

export const getErrorMessage = (
  err: unknown,
  fallback = 'An unknown error occurred'
): string => {
  if (isAxiosError(err)) {
    return err.message || fallback;
  }
  console.error('Generic error', err);
  return fallback;
};

export const formatError = (error: unknown): ApiErrorResponse => {
  if (isAxiosError(error)) {
    return {
      success: false,
      error: {
        code: error.response?.status || 500,
        message: error.response?.data?.message || error.message,
      },
    };
  }
  console.error('Generic error', error);
  return {
    success: false,
    error: {
      code: 500,
      message: getErrorMessage(error),
    },
  };
};

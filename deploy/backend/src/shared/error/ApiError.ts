import httpStatus from 'http-status';

import BaseError from 'shared/error/BaseError';

class ApiError extends BaseError {
  constructor(
    message: string,
    statusCode: number = httpStatus.BAD_REQUEST,
    isOperational: boolean = true,
    stack: string = '',
    public responseData?: any,
  ) {
    super(message, statusCode, isOperational, stack);
  }
}

export default ApiError;

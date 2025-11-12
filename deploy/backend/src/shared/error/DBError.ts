import httpStatus from 'http-status';

import BaseError from 'shared/error/BaseError';

class DBError extends BaseError {
  constructor(
    message: string,
    statusCode: number = httpStatus.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true,
    stack: string = '',
  ) {
    super(message, statusCode, isOperational, stack);
  }
}

export default DBError;

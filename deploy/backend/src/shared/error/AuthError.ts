import httpStatus from 'http-status';

import BaseError from 'shared/error/BaseError';

class AuthError extends BaseError {
  constructor(
    message: string,
    statusCode: number = httpStatus.UNAUTHORIZED,
    isOperational: boolean = true,
    stack: string = '',
  ) {
    super(message, statusCode, isOperational, stack);
  }
}

export default AuthError;

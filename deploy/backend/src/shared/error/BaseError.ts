abstract class BaseError extends Error {
  public statusCode: number;

  public isOperational: boolean;

  public stack?: string;

  constructor(message: string, statusCode: number, isOperational: boolean, stack: string = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default BaseError;

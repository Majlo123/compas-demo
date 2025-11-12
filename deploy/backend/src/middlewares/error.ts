import config from 'config/config';
import logger from 'config/logger';
import httpStatus from 'http-status';
import { errorRepository } from 'repos';
import ApiError from 'shared/error/ApiError';

export const errorConverter = (err: any, _req: any, _res: any, next: any): void => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || (httpStatus[statusCode] as string);
    error = new ApiError(message, statusCode, true, err.stack);
  }

  next(error);
};

/*  eslint-disable @typescript-eslint/no-unused-vars */
// @ts-ignore no unsued params
export const errorHandler = (err: any, _req: any, res: any, next: any): void => {
  let { statusCode, message } = err;
  if (config.env !== 'development' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  // eslint-disable-next-line no-param-reassign
  res.locals.errorMessage = err.message;

  const response = {
    success: false,
    error: {
      code: statusCode || '500',
      message: message || 'An unexpected error occurred',
    },
    ...(config.env === 'development' && { stack: err.stack }),
  };

  logger.error(err);

  errorRepository.create({
    message: err.message || 'An unexpected error occurred',
    stack: err.stack || 'Stack not available',
  });

  if (!res.headersSent) {
    res.status(statusCode).send(response);
  }
};

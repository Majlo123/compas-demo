import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { userService } from 'services';
import catchAsync from 'shared/utils/CatchAsync';
import QueryParams from 'repos/utils/query/QueryParams';

export const searchUsers = catchAsync(async (req: Request, res: Response) => {
  const query = (req.query.query as string) || '';
  const result = await userService.searchUsers(query);
  res.status(httpStatus.OK).send({
    success: true,
    content: result,
  });
});

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const queryParams = req.queryParams as QueryParams;
  const paginatedResult = await userService.findAll(queryParams);
  res.status(httpStatus.OK).send({
    success: true,
    content: paginatedResult,
  });
});
 

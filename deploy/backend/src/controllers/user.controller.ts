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

export const inviteUsers = catchAsync(async (req: Request, res: Response) => {
  const { emails } = req.body;
  if (!Array.isArray(emails) || emails.length === 0) {
    res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      error: { message: 'Emails array required' },
    });
    return;
  }
  const result = await userService.inviteUsers(emails);
  res.status(httpStatus.OK).send({
    success: true,
    content: result,
  });
});

export const deactivateUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const success = await userService.deactivate(userId);
  if (!success) {
    res.status(httpStatus.NOT_FOUND).send({
      success: false,
      error: { message: 'User not found' },
    });
    return;
  }
  res.status(httpStatus.OK).send({
    success: true,
    content: { deactivated: true },
  });
});
 

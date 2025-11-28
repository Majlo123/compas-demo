import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { userService } from 'services';
import catchAsync from 'shared/utils/CatchAsync';

export const searchUsers = catchAsync(async (req: Request, res: Response) => {
  const query = (req.query.query as string) || '';
  const result = await userService.searchUsers(query);
  res.status(httpStatus.OK).send({
    success: true,
    content: result,
  });
});

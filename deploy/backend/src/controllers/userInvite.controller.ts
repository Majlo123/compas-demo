import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { userInviteService } from 'services';
import catchAsync from 'shared/utils/CatchAsync';

export const createUserInvite = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  const result = await userInviteService.createUserInvite({ email });

  res.status(httpStatus.CREATED).send({
    success: true,
    content: result,
    message: 'User invite created successfully',
  });
});

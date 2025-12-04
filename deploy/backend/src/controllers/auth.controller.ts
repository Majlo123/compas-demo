import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { authService } from 'services';
import catchAsync from 'shared/utils/CatchAsync';
import assertAuthenticatedUser from 'shared/utils/assertAuth';

export const register = catchAsync(async (req: Request, res: Response) => {
  const { email, password, fullName, inviteToken } = req.body;
  const result = await authService.register({ email, password, fullName, inviteToken });

  res.status(httpStatus.CREATED).send({
    success: true,
    content: result,
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });

  res.status(httpStatus.OK).send({
    success: true,
    content: result,
  });
});

export const changePassword = catchAsync(async (req: Request, res: Response) => {
  assertAuthenticatedUser(req);
  const { currentPassword, newPassword } = req.body;
  const result = await authService.changePassword(req.user.id, currentPassword, newPassword);

  res.status(httpStatus.OK).send({
    success: true,
    message: result.message,
    content: result,
  });
});

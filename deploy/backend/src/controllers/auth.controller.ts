import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { authService } from 'services';
import catchAsync from 'shared/utils/CatchAsync';

export const register = catchAsync(async (req: Request, res: Response) => {
  const { email, password, fullName } = req.body;
  const result = await authService.register({ email, password, fullName });

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

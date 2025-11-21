import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { leaveRequestService } from 'services';
import catchAsync from 'shared/utils/CatchAsync';
import ApiError from 'shared/error/ApiError';

export const getMyLeaveRequests = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED);
  }

  const leaveRequests = await leaveRequestService.getUserLeaveRequests(userId);

  res.status(httpStatus.OK).send({
    success: true,
    content: leaveRequests,
  });
});

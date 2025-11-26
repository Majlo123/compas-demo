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

export const createLeaveRequest = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED);
  }

  const leaveRequest = await leaveRequestService.createLeaveRequest(userId, req.body);

  res.status(httpStatus.CREATED).send({
    success: true,
    message: 'Leave request created successfully',
    content: leaveRequest,
  });
});

export const getTeamLeaveRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await leaveRequestService.getTeamLeaveRequests(req.queryParams);

  res.status(httpStatus.OK).send({
    success: true,
    content: result,
  });
});

export const updateLeaveRequestStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const updatedRequest = await leaveRequestService.updateLeaveRequestStatus(id, status);

  res.status(httpStatus.OK).send({
    success: true,
    message: `Leave request ${status} successfully`,
    content: updatedRequest,
  });
});

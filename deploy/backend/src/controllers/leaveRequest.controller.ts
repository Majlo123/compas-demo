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
  const userId = req.user?.id;
  const userRole = req.user?.role;

  if (!userId || !userRole) {
    throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED);
  }

  const result = await leaveRequestService.getTeamLeaveRequests(userId, userRole, req.queryParams);

  res.status(httpStatus.OK).send({
    success: true,
    content: result,
  });
});

export const getCalendarLeaveRequests = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const userRole = req.user?.role;
  const teamId = req.query.teamId as string | undefined;

  if (!userId || !userRole) {
    throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED);
  }

  const result = await leaveRequestService.getCalendarLeaveRequests(userId, userRole, teamId);
  res.status(httpStatus.OK).send({
    success: true,
    content: result,
  });
});

export const updateLeaveRequestStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user?.id;
  const userRole = req.user?.role;

  if (!userId || !userRole) {
    throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED);
  }

  const updatedRequest = await leaveRequestService.updateLeaveRequestStatus(userId, userRole, id, status);

  res.status(httpStatus.OK).send({
    success: true,
    message: `Leave request ${status} successfully`,
    content: updatedRequest,
  });
});

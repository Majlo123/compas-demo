import httpStatus from 'http-status';
import { leaveRequestRepository } from 'repos/index';
import { LeaveRequest, CreateLeaveRequest, LeaveRequestType } from 'repos/leaveRequest.model';
import ApiError from 'shared/error/ApiError';

export type LeaveRequestResponse = {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  reason?: string;
  createdAt: string;
};

export type CreateLeaveRequestInput = {
  type: LeaveRequestType;
  startDate: string;
  endDate: string;
  reason?: string;
};

/**
 * Get all leave requests for a specific user
 */
export const getUserLeaveRequests = async (userId: string): Promise<LeaveRequestResponse[]> => {
  if (!userId) {
    throw new ApiError('User ID is required', httpStatus.BAD_REQUEST);
  }

  const leaveRequests = await leaveRequestRepository.findByUserId(userId);

  return leaveRequests.map((request: LeaveRequest) => ({
    id: request.id!,
    type: request.type,
    startDate: request.startDate.toISOString().split('T')[0],
    endDate: request.endDate.toISOString().split('T')[0],
    status: request.status,
    reason: request.reason,
    createdAt: request.createdAt!.toISOString(),
  }));
};

/**
 * Create a new leave request
 */
export const createLeaveRequest = async (
  userId: string,
  data: CreateLeaveRequestInput
): Promise<LeaveRequestResponse> => {
  if (!userId) {
    throw new ApiError('User ID is required', httpStatus.BAD_REQUEST);
  }

  // Validate dates
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new ApiError('Invalid date format', httpStatus.BAD_REQUEST);
  }

  if (startDate < today) {
    throw new ApiError('Start date cannot be in the past', httpStatus.BAD_REQUEST);
  }

  if (endDate < startDate) {
    throw new ApiError('End date cannot be before start date', httpStatus.BAD_REQUEST);
  }

  const leaveRequestData: CreateLeaveRequest = {
    userId,
    type: data.type,
    startDate,
    endDate,
    status: 'pending',
    reason: data.reason,
  };

  const createdRequest = await leaveRequestRepository.create(leaveRequestData);

  return {
    id: createdRequest.id!,
    type: createdRequest.type,
    startDate: createdRequest.startDate.toISOString().split('T')[0],
    endDate: createdRequest.endDate.toISOString().split('T')[0],
    status: createdRequest.status,
    reason: createdRequest.reason,
    createdAt: createdRequest.createdAt!.toISOString(),
  };
};

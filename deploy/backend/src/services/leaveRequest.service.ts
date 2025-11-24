import httpStatus from 'http-status';
import { leaveRequestRepository } from 'repos/index';
import { LeaveRequest } from 'repos/leaveRequest.model';
import QueryParams from 'repos/utils/query/QueryParams';
import { PaginatedResult } from 'repos/utils/pagination';
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
 * Get all team leave requests with pagination and sorting (for managers)
 */
export const getTeamLeaveRequests = async (
  queryParams: QueryParams
): Promise<PaginatedResult<LeaveRequestResponse>> => {
  const paginatedResult = await leaveRequestRepository.findAllWithQuery(queryParams);

  return {
    data: paginatedResult.data.map((request: LeaveRequest) => ({
      id: request.id!,
      type: request.type,
      startDate: request.startDate.toISOString().split('T')[0],
      endDate: request.endDate.toISOString().split('T')[0],
      status: request.status,
      reason: request.reason,
      createdAt: request.createdAt!.toISOString(),
    })),
    page: paginatedResult.page,
    pageSize: paginatedResult.pageSize,
    totalItems: paginatedResult.totalItems,
    totalPages: paginatedResult.totalPages,
  };
};

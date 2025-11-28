import httpStatus from 'http-status';
import { leaveRequestRepository, teamMemberRepository } from 'repos/index';
import { LeaveRequest, LeaveRequestWithEmployee, CreateLeaveRequest, LeaveRequestType } from 'repos/leaveRequest.model';
import QueryParams from 'repos/utils/query/QueryParams';
import { PaginatedResult } from 'repos/utils/pagination';
import ApiError from 'shared/error/ApiError';
import { RoleEnum } from '../../../shared/auth.types';

export type LeaveRequestResponse = {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  reason?: string;
  createdAt: string;
  employeeName?: string;
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

/**
 * Get all team leave requests with pagination and sorting (for managers)
 */
export const getTeamLeaveRequests = async (
  queryParams: QueryParams
): Promise<PaginatedResult<LeaveRequestResponse>> => {
  const paginatedResult = await leaveRequestRepository.findAllWithFilters(queryParams);

  return {
    data: paginatedResult.data.map((request: LeaveRequestWithEmployee) => ({
      id: request.id!,
      type: request.type,
      startDate: request.startDate.toISOString().split('T')[0],
      endDate: request.endDate.toISOString().split('T')[0],
      status: request.status,
      reason: request.reason,
      createdAt: request.createdAt!.toISOString(),
      employeeName: request.employeeName,
    })),
    page: paginatedResult.page,
    pageSize: paginatedResult.pageSize,
    totalItems: paginatedResult.totalItems,
    totalPages: paginatedResult.totalPages,
  };
};

/**
 * Update leave request status (for managers)
 */
export const updateLeaveRequestStatus = async (
  id: string,
  status: 'approved' | 'declined'
): Promise<LeaveRequestResponse> => {
  const existingRequest = await leaveRequestRepository.findById({ id });

  if (!existingRequest) {
    throw new ApiError('Leave request not found', httpStatus.NOT_FOUND);
  }

  if (existingRequest.status !== 'pending') {
    throw new ApiError('Only pending requests can be updated', httpStatus.BAD_REQUEST);
  }

  const updatedRequest = await leaveRequestRepository.updateStatus(id, status);

  if (!updatedRequest) {
    throw new ApiError('Failed to update leave request', httpStatus.INTERNAL_SERVER_ERROR);
  }

  return {
    id: updatedRequest.id!,
    type: updatedRequest.type,
    startDate: updatedRequest.startDate.toISOString().split('T')[0],
    endDate: updatedRequest.endDate.toISOString().split('T')[0],
    status: updatedRequest.status,
    reason: updatedRequest.reason,
    createdAt: updatedRequest.createdAt!.toISOString(),
  };
};

 // Get all leave requests for calendar (no pagination)

export const getCalendarLeaveRequests = async (userId: string, userRole: string): Promise<LeaveRequestResponse[]> => {
  let result: LeaveRequestWithEmployee[];

  if (userRole === RoleEnum.Admin) {
    result = await leaveRequestRepository.findAllForCalendar();
  } else {
    const userTeams = await teamMemberRepository.findByUserId(userId);
    const teamIds = userTeams.map(team => team.teamId);

    if (teamIds.length === 0) {
      result = await leaveRequestRepository.findAllForCalendar({ userId });
    } else {
      const teamResults = await leaveRequestRepository.findAllForCalendar({ teamIds });      const ownResults = await leaveRequestRepository.findAllForCalendar({ userId });

      const merged = new Map<string, LeaveRequestWithEmployee>();
      [...teamResults, ...ownResults].forEach((r) => {
        if (r.id) merged.set(r.id, r);
      });
      result = Array.from(merged.values());
    }
  }

  return result.map((request: LeaveRequestWithEmployee) => ({
    id: request.id!,
    type: request.type,
    startDate: request.startDate.toISOString().split('T')[0],
    endDate: request.endDate.toISOString().split('T')[0],
    status: request.status,
    reason: request.reason,
    createdAt: request.createdAt!.toISOString(),
    employeeName: request.employeeName,
  }));
};

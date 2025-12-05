import httpStatus from 'http-status';
import { leaveRequestRepository, teamMemberRepository, userRepository } from 'repos/index';
import { LeaveRequest, LeaveRequestWithEmployee, CreateLeaveRequest, LeaveRequestType } from 'repos/leaveRequest.model';
import QueryParams from 'repos/utils/query/QueryParams';
import { PaginatedResult } from 'repos/utils/pagination';
import ApiError from 'shared/error/ApiError';
import { RoleEnum } from '../../../shared/auth.types';
import logger from 'config/logger';
import { sendLeaveRequestNotification, sendLeaveStatusUpdateEmail } from './email.service';
import { createNotification, updateNotificationsForLeaveRequest } from './notification.service';

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

  // Fire-and-forget notifications to team managers
  (async () => {
    try {
      logger.info(`Leave request ${createdRequest.id} created; preparing manager notifications for user ${userId}`);
      const requester = await userRepository.findById({ id: userId });
      if (!requester) return;

      const memberships = await teamMemberRepository.findByUserId(userId);
      logger.info(`Requester team memberships fetched: count=${memberships.length}`);
      if (!memberships || memberships.length === 0) {
        logger.info('No team memberships; skipping manager notifications');
        return;
      }

      // Collect manager emails across all teams the requester belongs to
      const teamsMembers = await Promise.all(
        memberships.map((m) => teamMemberRepository.findByTeamId(m.teamId))
      );
      const managerEmailsSet = new Set<string>();
      const managerEmailsWithPreferences: Record<string, boolean> = {};
      
      teamsMembers.flat().
        filter(tm => tm.isManager && tm.email).
        forEach(tm => {
          managerEmailsSet.add(tm.email!);
        });

      // Get email notification preferences for all managers
      const managerUsersPromises = Array.from(managerEmailsSet).map((email) => 
        userRepository.findByEmail(email)
      );
      const managerUsers = await Promise.all(managerUsersPromises);
      managerUsers.forEach((manager) => {
        if (manager && manager.email) {
          managerEmailsWithPreferences[manager.email] = manager.emailNotificationsEnabled ?? true;
        }
      });

      const managerEmails = Array.from(managerEmailsSet);
      logger.info(`Manager recipients resolved: ${managerEmails.join(', ')}`);
      if (managerEmails.length === 0) {
        logger.info('No manager recipients; skipping notifications');
        return;
      }

      await sendLeaveRequestNotification(managerEmails, {
        requesterName: requester.fullName,
        requesterEmail: requester.email,
        type: createdRequest.type,
        startDate: createdRequest.startDate,
        endDate: createdRequest.endDate,
        reason: createdRequest.reason,
        requestId: createdRequest.id!,
      }, managerEmailsWithPreferences);
      logger.info(`Manager notifications sent to ${managerEmails.length} recipients`);

      // Create in-app notifications for each manager
      const notificationPromises = managerUsers
        .filter((manager): manager is NonNullable<typeof manager> => manager !== null)
        .map((manager) =>
          createNotification({
            userId: manager.id!,
            leaveRequestId: createdRequest.id!,
            title: `${requester.fullName} requested ${createdRequest.type} leave`,
            isRead: false,
          })
        );
      
      await Promise.all(notificationPromises);
      logger.info(`In-app notifications created for ${managerUsers.filter((m) => m !== null).length} managers`);
    } catch (err) {
      logger.warn(`Failed to send manager notification for leave request: ${String(err)}`);
    }
  })();

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
 * Admins see all requests, team managers see only requests from teams they manage
 */
export const getTeamLeaveRequests = async (
  userId: string,
  userRole: string,
  queryParams: QueryParams
): Promise<PaginatedResult<LeaveRequestResponse>> => {
  let managedTeamIds: string[] | undefined;

  // For team managers, get teams they manage
  if (userRole !== RoleEnum.Admin) {
    managedTeamIds = await teamMemberRepository.getTeamsWhereUserIsManager(userId);
    
    if (managedTeamIds.length === 0) {
      throw new ApiError('You are not a manager of any team', httpStatus.FORBIDDEN);
    }

    // Check if there's a teamId filter - if yes, validate it's one of the managed teams
    const teamIdFilter = queryParams.filters?.find(f => f.filterKey === 'teamId');
    if (teamIdFilter) {
      const requestedTeamId = String(teamIdFilter.value);
      if (!managedTeamIds.includes(requestedTeamId)) {
        throw new ApiError('You are not a manager of the requested team', httpStatus.FORBIDDEN);
      }
      // If specific team requested, don't pass managedTeamIds (let the filter handle it)
      managedTeamIds = undefined;
    }
  }

  // Call repository with or without team filter based on role
  const paginatedResult = await leaveRequestRepository.findAllWithFilters(queryParams, managedTeamIds);

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
 * Admins can update any request, team managers can update only requests from teams they manage
 */
export const updateLeaveRequestStatus = async (
  userId: string,
  userRole: string,
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

  // Admin can update any request
  if (userRole !== RoleEnum.Admin) {
    // Check if user is manager in at least one of the teams where request user is member
    const requestUserTeams = await teamMemberRepository.findByUserId(existingRequest.userId);
    
    const hasPermission = await Promise.all(
      requestUserTeams.map(team => teamMemberRepository.isManagerForTeam(userId, team.teamId))
    ).then(results => results.some(isManager => isManager));
    
    if (!hasPermission) {
      throw new ApiError('You do not have permission to update this leave request', httpStatus.FORBIDDEN);
    }
  }

  const updatedRequest = await leaveRequestRepository.updateStatus(id, status);

  if (!updatedRequest) {
    throw new ApiError('Failed to update leave request', httpStatus.INTERNAL_SERVER_ERROR);
  }

  // Notify requester of status change (synchronous for real-time socket emission)
  try {
    const requester = await userRepository.findById({ id: updatedRequest.userId });
    if (requester) {
      // Create in-app notification for requester (emits socket event immediately)
      const statusText = status === 'approved' ? 'approved' : 'declined';
      await createNotification({
        userId: updatedRequest.userId,
        leaveRequestId: updatedRequest.id!,
        title: `Your ${updatedRequest.type} leave request was ${statusText}`,
        isRead: false,
      });
      logger.info(`In-app notification created for requester ${requester.email}`);

      // Send email notification (fire-and-forget - doesn't need to be real-time)
      sendLeaveStatusUpdateEmail(requester.email, {
        requesterName: requester.fullName,
        requesterEmail: requester.email,
        type: updatedRequest.type,
        startDate: updatedRequest.startDate,
        endDate: updatedRequest.endDate,
        status,
        requestId: updatedRequest.id!,
      }, requester.emailNotificationsEnabled).catch((err) => {
        logger.warn(`Failed to send status update email: ${String(err)}`);
      });
    }
  } catch (err) {
    logger.warn(`Failed to create status update notification: ${String(err)}`);
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

/**
 * Update an existing leave request (user can only update their own pending requests)
 */
export const updateLeaveRequest = async (
  userId: string,
  id: string,
  data: CreateLeaveRequestInput
): Promise<LeaveRequestResponse> => {
  const existingRequest = await leaveRequestRepository.findById({ id });

  if (!existingRequest) {
    throw new ApiError('Leave request not found', httpStatus.NOT_FOUND);
  }

  // Only the owner can update their request
  if (existingRequest.userId !== userId) {
    throw new ApiError('You can only update your own leave requests', httpStatus.FORBIDDEN);
  }

  // Only pending requests can be updated
  if (existingRequest.status !== 'pending') {
    throw new ApiError('Only pending requests can be updated', httpStatus.BAD_REQUEST);
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

  const updateData = {
    type: data.type,
    startDate,
    endDate,
    reason: data.reason,
  };

  const updatedRequest = await leaveRequestRepository.updateById(id, updateData);

  if (!updatedRequest) {
    throw new ApiError('Failed to update leave request', httpStatus.INTERNAL_SERVER_ERROR);
  }

  // Update related notifications if the type has changed
  if (existingRequest.type !== updatedRequest.type) {
    try {
      const requester = await userRepository.findById({ id: userId });
      if (requester) {
        const newNotificationTitle = `${requester.fullName} requested ${updatedRequest.type} leave`;
        await updateNotificationsForLeaveRequest(id, newNotificationTitle);
        logger.info(`Updated notifications for leave request ${id} after type change from ${existingRequest.type} to ${updatedRequest.type}`);
      }
    } catch (err) {
      logger.warn(`Failed to update notifications for leave request ${id}: ${String(err)}`);
    }
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

/**
 * Delete a leave request (user can only delete their own pending requests)
 */
export const deleteLeaveRequest = async (
  userId: string,
  id: string
): Promise<void> => {
  const existingRequest = await leaveRequestRepository.findById({ id });

  if (!existingRequest) {
    throw new ApiError('Leave request not found', httpStatus.NOT_FOUND);
  }

  // Only the owner can delete their request
  if (existingRequest.userId !== userId) {
    throw new ApiError('You can only delete your own leave requests', httpStatus.FORBIDDEN);
  }

  // Only pending requests can be deleted
  if (existingRequest.status !== 'pending') {
    throw new ApiError('Only pending requests can be deleted', httpStatus.BAD_REQUEST);
  }

  await leaveRequestRepository.deleteById( id );
};

 // Get all leave requests for calendar (no pagination)

export const getCalendarLeaveRequests = async (
  userId: string, 
  userRole: string, 
  teamId?: string
): Promise<LeaveRequestResponse[]> => {
  let result: LeaveRequestWithEmployee[];

  if (userRole === RoleEnum.Admin) {
    // Admin: if teamId provided, filter by that team; otherwise show all
    if (teamId) {
      result = await leaveRequestRepository.findAllForCalendar({ teamIds: [teamId] });
    } else {
      result = await leaveRequestRepository.findAllForCalendar();
    }
  } else {
    const userTeams = await teamMemberRepository.findByUserId(userId);
    const managedTeams = await teamMemberRepository.getTeamsWhereUserIsManager(userId);
    
    // If teamId filter is provided, validate user has access to that team
    if (teamId) {
      const hasAccessToTeam = userTeams.some(team => team.teamId === teamId) || 
                              managedTeams.includes(teamId);
      
      if (!hasAccessToTeam) {
        throw new ApiError('You do not have access to this team', httpStatus.FORBIDDEN);
      }
      
      result = await leaveRequestRepository.findAllForCalendar({ teamIds: [teamId] });
    } else {
      // No filter: show own requests + all managed teams
      const teamIds = userTeams.map(team => team.teamId);

      if (teamIds.length === 0) {
        result = await leaveRequestRepository.findAllForCalendar({ userId });
      } else {
        const teamResults = await leaveRequestRepository.findAllForCalendar({ teamIds });      
        const ownResults = await leaveRequestRepository.findAllForCalendar({ userId });

        const merged = new Map<string, LeaveRequestWithEmployee>();
        [...teamResults, ...ownResults].forEach((r) => {
          if (r.id) merged.set(r.id, r);
        });
        result = Array.from(merged.values());
      }
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

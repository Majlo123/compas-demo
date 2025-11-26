import { leaveRequestController } from 'controllers';
import { EndpointMeta } from 'docs/swagger';
import { Router, RequestHandler } from 'express';
import httpStatus from 'http-status';
import { RoleEnum } from '../../../../shared/auth.types';

import registerEndpointRoutes from 'routes/registerEndpointRoutes';
import { 
  LeaveRequestSuccessSchema, 
  CreateLeaveRequestBodySchema,
  CreateLeaveRequestSuccessSchema,
  PaginatedLeaveRequestSuccessSchema,
  UpdateLeaveRequestStatusBodySchema,
  UpdateLeaveRequestStatusSuccessSchema,
} from 'types/zod/leaveRequest.schema';
import {
  UnauthorizedResponseSchema,
  ForbiddenResponseSchema,
  BadRequestResponseSchema,
  QuerySchema,
} from 'types/zod/shared.schema';

enum LeaveRequestFunctions {
  getMyLeaveRequests = 'getMyLeaveRequests',
  createLeaveRequest = 'createLeaveRequest',
  getTeamLeaveRequests = 'getTeamLeaveRequests',
  getCalendarLeaveRequests = 'getCalendarLeaveRequests',
  updateLeaveRequestStatus = 'updateLeaveRequestStatus',
}

const createLeaveRequestRoute = (basePath: string): Router => {
  const endpointsMeta: EndpointMeta[] = [
    {
      name: 'Get My Leave Requests',
      desc: 'Get all leave requests for the authenticated user',
      path: '/my-requests',
      method: 'get',
      authorize: true,
      allowedRoles: [RoleEnum.Employee],
      responses: [
        {
          code: httpStatus.OK,
          desc: 'Leave requests retrieved successfully',
          schema: LeaveRequestSuccessSchema,
        },
        {
          code: httpStatus.UNAUTHORIZED,
          desc: 'User not authenticated',
          schema: UnauthorizedResponseSchema,
        },
        {
          code: httpStatus.FORBIDDEN,
          desc: 'User not authorized',
          schema: ForbiddenResponseSchema,
        },
      ],
      functionName: LeaveRequestFunctions.getMyLeaveRequests,
      basePath,
    },
    {
      name: 'Create Leave Request',
      desc: 'Create a new leave request for the authenticated user',
      path: '/',
      method: 'post',
      authorize: true,
      allowedRoles: [RoleEnum.Employee],
      requestBodySchema: CreateLeaveRequestBodySchema,
      responses: [
        {
          code: httpStatus.CREATED,
          desc: 'Leave request created successfully',
          schema: CreateLeaveRequestSuccessSchema,
        },
        {
          code: httpStatus.BAD_REQUEST,
          desc: 'Invalid request data',
          schema: BadRequestResponseSchema,
        },
        {
          code: httpStatus.UNAUTHORIZED,
          desc: 'User not authenticated',
          schema: UnauthorizedResponseSchema,
        },
        {
          code: httpStatus.FORBIDDEN,
          desc: 'User not authorized',
          schema: ForbiddenResponseSchema,
        },
      ],
      functionName: LeaveRequestFunctions.createLeaveRequest,
      basePath,
    },
    {
      name: 'Get Team Leave Requests',
      desc: 'Get all leave requests for the team with pagination (managers only)',
      path: '/team-requests',
      method: 'get',
      authorize: true,
      allowedRoles: [RoleEnum.Manager],
      querySchema: QuerySchema,
      responses: [
        {
          code: httpStatus.OK,
          desc: 'Team leave requests retrieved successfully',
          schema: PaginatedLeaveRequestSuccessSchema,
        },
        {
          code: httpStatus.UNAUTHORIZED,
          desc: 'User not authenticated',
          schema: UnauthorizedResponseSchema,
        },
        {
          code: httpStatus.FORBIDDEN,
          desc: 'User not authorized (requires manager role)',
          schema: ForbiddenResponseSchema,
        },
      ],
      functionName: LeaveRequestFunctions.getTeamLeaveRequests,
      basePath,
    },
    {
      name: 'Get Calendar Leave Requests',
      desc: 'Get all leave requests for calendar (managers and admins)',
      path: '/calendar',
      method: 'get',
      authorize: true,
      allowedRoles: [RoleEnum.Manager, RoleEnum.Admin],
      responses: [
        {
          code: httpStatus.OK,
          desc: 'Calendar leave requests retrieved successfully',
          schema: LeaveRequestSuccessSchema,
        },
        {
          code: httpStatus.UNAUTHORIZED,
          desc: 'User not authenticated',
          schema: UnauthorizedResponseSchema,
        },
        {
          code: httpStatus.FORBIDDEN,
          desc: 'User not authorized',
          schema: ForbiddenResponseSchema,
        },
      ],
      functionName: LeaveRequestFunctions.getCalendarLeaveRequests,
      basePath,
    },
    {
      name: 'Update Leave Request Status',
      desc: 'Approve or decline a leave request (managers only)',
      path: '/:id/status',
      method: 'patch',
      authorize: true,
      allowedRoles: [RoleEnum.Manager],
      requestBodySchema: UpdateLeaveRequestStatusBodySchema,
      responses: [
        {
          code: httpStatus.OK,
          desc: 'Leave request status updated successfully',
          schema: UpdateLeaveRequestStatusSuccessSchema,
        },
        {
          code: httpStatus.BAD_REQUEST,
          desc: 'Invalid request data or status',
          schema: BadRequestResponseSchema,
        },
        {
          code: httpStatus.NOT_FOUND,
          desc: 'Leave request not found',
          schema: BadRequestResponseSchema,
        },
        {
          code: httpStatus.UNAUTHORIZED,
          desc: 'User not authenticated',
          schema: UnauthorizedResponseSchema,
        },
        {
          code: httpStatus.FORBIDDEN,
          desc: 'User not authorized (requires manager role)',
          schema: ForbiddenResponseSchema,
        },
      ],
      functionName: LeaveRequestFunctions.updateLeaveRequestStatus,
      basePath,
    },
  ];

  const leaveRequestControllerFunctions: Record<LeaveRequestFunctions, RequestHandler> = {
    getMyLeaveRequests: leaveRequestController.getMyLeaveRequests,
    createLeaveRequest: leaveRequestController.createLeaveRequest,
    getTeamLeaveRequests: leaveRequestController.getTeamLeaveRequests,
    getCalendarLeaveRequests: leaveRequestController.getCalendarLeaveRequests,
    updateLeaveRequestStatus: leaveRequestController.updateLeaveRequestStatus,
  };

  const router = Router();
  registerEndpointRoutes(router, endpointsMeta, leaveRequestControllerFunctions);
  return router;
};

export default createLeaveRequestRoute;

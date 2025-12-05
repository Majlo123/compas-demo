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
  BaseResponseSchema,
} from 'types/zod/shared.schema';

enum LeaveRequestFunctions {
  getMyLeaveRequests = 'getMyLeaveRequests',
  createLeaveRequest = 'createLeaveRequest',
  getTeamLeaveRequests = 'getTeamLeaveRequests',
  getCalendarLeaveRequests = 'getCalendarLeaveRequests',
  updateLeaveRequestStatus = 'updateLeaveRequestStatus',
  updateLeaveRequest = 'updateLeaveRequest',
  deleteLeaveRequest = 'deleteLeaveRequest',
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
      desc: 'Get all leave requests for the team with pagination',
      path: '/team-requests',
      method: 'get',
      authorize: true,
      allowedRoles: [RoleEnum.Employee, RoleEnum.Admin],
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
      desc: 'Get leave requests for calendar - admins see all, managers/users see their teams only',
      path: '/calendar',
      method: 'get',
      authorize: true,
      allowedRoles: [RoleEnum.Employee, RoleEnum.Admin],
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
      desc: 'Approve or decline a leave request (team managers and admins only)',
      path: '/:id/status',
      method: 'patch',
      authorize: true,
      allowedRoles: [RoleEnum.Employee, RoleEnum.Admin],
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
    {
      name: 'Update Leave Request',
      desc: 'Update an existing leave request (user can only update their own pending requests)',
      path: '/:id',
      method: 'put',
      authorize: true,
      allowedRoles: [RoleEnum.Employee],
      requestBodySchema: CreateLeaveRequestBodySchema,
      responses: [
        {
          code: httpStatus.OK,
          desc: 'Leave request updated successfully',
          schema: CreateLeaveRequestSuccessSchema,
        },
        {
          code: httpStatus.BAD_REQUEST,
          desc: 'Invalid request data or only pending requests can be updated',
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
          desc: 'User can only update their own leave requests',
          schema: ForbiddenResponseSchema,
        },
      ],
      functionName: LeaveRequestFunctions.updateLeaveRequest,
      basePath,
    },
    {
      name: 'Delete Leave Request',
      desc: 'Delete (cancel) a leave request (user can only delete their own pending requests)',
      path: '/:id',
      method: 'delete',
      authorize: true,
      allowedRoles: [RoleEnum.Employee, RoleEnum.Admin],
      responses: [
        {
          code: httpStatus.OK,
          desc: 'Leave request cancelled successfully',
          schema: BaseResponseSchema,
        },
        {
          code: httpStatus.BAD_REQUEST,
          desc: 'Only pending requests can be deleted',
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
          desc: 'User can only delete their own leave requests',
          schema: ForbiddenResponseSchema,
        },
      ],
      functionName: LeaveRequestFunctions.deleteLeaveRequest,
      basePath,
    },
  ];

  const leaveRequestControllerFunctions: Record<LeaveRequestFunctions, RequestHandler> = {
    getMyLeaveRequests: leaveRequestController.getMyLeaveRequests,
    createLeaveRequest: leaveRequestController.createLeaveRequest,
    getTeamLeaveRequests: leaveRequestController.getTeamLeaveRequests,
    getCalendarLeaveRequests: leaveRequestController.getCalendarLeaveRequests,
    updateLeaveRequestStatus: leaveRequestController.updateLeaveRequestStatus,
    updateLeaveRequest: leaveRequestController.updateLeaveRequest,
    deleteLeaveRequest: leaveRequestController.deleteLeaveRequest,
  };

  const router = Router();
  registerEndpointRoutes(router, endpointsMeta, leaveRequestControllerFunctions);
  return router;
};

export default createLeaveRequestRoute;

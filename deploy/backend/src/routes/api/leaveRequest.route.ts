import { leaveRequestController } from 'controllers';
import { EndpointMeta } from 'docs/swagger';
import { Router, RequestHandler } from 'express';
import httpStatus from 'http-status';

import registerEndpointRoutes from 'routes/registerEndpointRoutes';
import { 
  LeaveRequestSuccessSchema,
  CreateLeaveRequestBodySchema,
  CreateLeaveRequestSuccessSchema,
} from 'types/zod/leaveRequest.schema';
import {
  UnauthorizedResponseSchema,
  ForbiddenResponseSchema,
  BadRequestResponseSchema,
} from 'types/zod/shared.schema';

enum LeaveRequestFunctions {
  getMyLeaveRequests = 'getMyLeaveRequests',
  createLeaveRequest = 'createLeaveRequest',
}

const createLeaveRequestRoute = (basePath: string): Router => {
  const endpointsMeta: EndpointMeta[] = [
    {
      name: 'Get My Leave Requests',
      desc: 'Get all leave requests for the authenticated user',
      path: '/my-requests',
      method: 'get',
      authorize: true,
      allowedRoles: ['employee'],
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
  ];

  const leaveRequestControllerFunctions: Record<LeaveRequestFunctions, RequestHandler> = {
    getMyLeaveRequests: leaveRequestController.getMyLeaveRequests,
    createLeaveRequest: leaveRequestController.createLeaveRequest,
  };

  const router = Router();
  registerEndpointRoutes(router, endpointsMeta, leaveRequestControllerFunctions);
  return router;
};

export default createLeaveRequestRoute;

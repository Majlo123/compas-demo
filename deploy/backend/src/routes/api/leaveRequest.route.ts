import { leaveRequestController } from 'controllers';
import { EndpointMeta } from 'docs/swagger';
import { Router, RequestHandler } from 'express';
import httpStatus from 'http-status';

import registerEndpointRoutes from 'routes/registerEndpointRoutes';
import { LeaveRequestSuccessSchema } from 'types/zod/leaveRequest.schema';
import {
  UnauthorizedResponseSchema,
  ForbiddenResponseSchema,
} from 'types/zod/shared.schema';

enum LeaveRequestFunctions {
  getMyLeaveRequests = 'getMyLeaveRequests',
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
  ];

  const leaveRequestControllerFunctions: Record<LeaveRequestFunctions, RequestHandler> = {
    getMyLeaveRequests: leaveRequestController.getMyLeaveRequests,
  };

  const router = Router();
  registerEndpointRoutes(router, endpointsMeta, leaveRequestControllerFunctions);
  return router;
};

export default createLeaveRequestRoute;

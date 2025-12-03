import { userInviteController } from 'controllers';
import { EndpointMeta } from 'docs/swagger';
import { Router, RequestHandler } from 'express';
import httpStatus from 'http-status';
import { RoleEnum } from '../../../../shared/auth.types';

import registerEndpointRoutes from 'routes/registerEndpointRoutes';
import {
  BadRequestResponseSchema,
  UnauthorizedResponseSchema,
  NotFoundResponseSchema,
} from 'types/zod/shared.schema';
import {
  CreateUserInviteBodySchema,
  CreateUserInviteSuccessSchema,
} from 'types/zod/userInvite.schema';

enum UserInviteFunctions {
  create = 'createUserInvite',
}

const createUserInviteRoute = (basePath: string): Router => {
  const endpointsMeta: EndpointMeta[] = [
    {
      name: 'Create User Invite',
      desc: 'Generate a user invite for registration',
      path: '/',
      method: 'post',
      requestBodySchema: CreateUserInviteBodySchema,
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      responses: [
        {
          code: httpStatus.CREATED,
          desc: 'User invite created',
          schema: CreateUserInviteSuccessSchema,
        },
        { 
          code: httpStatus.BAD_REQUEST, 
          desc: 'Invalid request or email already exists', 
          schema: BadRequestResponseSchema 
        },
        {
          code: httpStatus.NOT_FOUND,
          desc: 'Team not found',
          schema: NotFoundResponseSchema,
        },
        {
          code: httpStatus.UNAUTHORIZED,
          desc: 'Unauthorized',
          schema: UnauthorizedResponseSchema,
        },
      ],
      functionName: UserInviteFunctions.create,
      basePath,
    },
  ];

  const endpointsHandlers: Record<UserInviteFunctions, RequestHandler> = {
    createUserInvite: userInviteController.createUserInvite as RequestHandler,
  };

  const router = Router();
  registerEndpointRoutes(router, endpointsMeta, endpointsHandlers);
  return router;
};

export default createUserInviteRoute;

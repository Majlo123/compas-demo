import { authController } from 'controllers';
import { EndpointMeta } from 'docs/swagger';
import { Router, RequestHandler } from 'express';
import httpStatus from 'http-status';

import registerEndpointRoutes from 'routes/registerEndpointRoutes';
import { LoginSchema, LoginSuccessSchema } from 'types/zod/auth.schema';
import {
  BadRequestResponseSchema,
  UnauthorizedResponseSchema,
} from 'types/zod/shared.schema';

enum AuthFunctions {
  login = 'login',
}

const createAuthRoute = (basePath: string): Router => {
  const endpointsMeta: EndpointMeta[] = [
    {
      name: 'Login',
      desc: 'Authenticate user and return JWT token',
      path: '/login',
      method: 'post',
      requestBodySchema: LoginSchema,
      responses: [
        {
          code: httpStatus.OK,
          desc: 'Login successful',
          schema: LoginSuccessSchema,
        },
        {
          code: httpStatus.UNAUTHORIZED,
          desc: 'Invalid credentials',
          schema: UnauthorizedResponseSchema,
        },
        {
          code: httpStatus.BAD_REQUEST,
          desc: 'Invalid request format',
          schema: BadRequestResponseSchema,
        },
      ],
      functionName: AuthFunctions.login,
      basePath,
    },
  ];

  const authControllerFunctions: Record<AuthFunctions, RequestHandler> = {
    login: authController.login,
  };

  const router = Router();
  registerEndpointRoutes(router, endpointsMeta, authControllerFunctions);
  return router;
};

export default createAuthRoute;

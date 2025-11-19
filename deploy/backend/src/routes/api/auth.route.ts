import { authController } from 'controllers';
import { EndpointMeta } from 'docs/swagger';
import { Router, RequestHandler } from 'express';
import httpStatus from 'http-status';

import registerEndpointRoutes from 'routes/registerEndpointRoutes';
import { LoginSchema, RegisterSchema, LoginSuccessSchema } from 'types/zod/auth.schema';
import {
  BadRequestResponseSchema,
  UnauthorizedResponseSchema,
} from 'types/zod/shared.schema';

enum AuthFunctions {
  login = 'login',
  register = 'register',
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
    {
      name: 'Register',
      desc: 'Register a new user and return JWT token',
      path: '/register',
      method: 'post',
      requestBodySchema: RegisterSchema,
      responses: [
        {
          code: httpStatus.CREATED,
          desc: 'Registration successful',
          schema: LoginSuccessSchema,
        },
        {
          code: httpStatus.BAD_REQUEST,
          desc: 'Invalid request or email already registered',
          schema: BadRequestResponseSchema,
        },
      ],
      functionName: AuthFunctions.register,
      basePath,
    },
  ];

  const authControllerFunctions: Record<AuthFunctions, RequestHandler> = {
    login: authController.login,
    register: authController.register,
  };

  const router = Router();
  registerEndpointRoutes(router, endpointsMeta, authControllerFunctions);
  return router;
};

export default createAuthRoute;

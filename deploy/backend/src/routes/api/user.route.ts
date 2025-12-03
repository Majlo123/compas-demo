import { userController } from 'controllers';
import { EndpointMeta } from 'docs/swagger';
import { Router, RequestHandler } from 'express';
import httpStatus from 'http-status';
import registerEndpointRoutes from 'routes/registerEndpointRoutes';
import { SearchUsersResponseSchema, UserSchema } from 'types/zod/user.schema';
import { QuerySchema, PaginatedResponseSchema } from 'types/zod/shared.schema';
import { RoleEnum } from '../../../../shared/auth.types';

enum UserFunctions {
  searchUsers = 'searchUsers',
  getAllUsers = 'getAllUsers',
  deactivateUser = 'deactivateUser',
}

const createUserRoute = (basePath: string): Router => {
  const endpointsMeta: EndpointMeta[] = [
    {
      name: 'Search Users',
      desc: 'Search users by name or email',
      path: '/search',
      method: 'get',
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      responses: [
        { code: httpStatus.OK, desc: 'Users list', schema: SearchUsersResponseSchema },
      ],
      functionName: UserFunctions.searchUsers,
      basePath,
    },
    {
      name: 'Get All Users',
      desc: 'Get list of all users',
      path: '/', 
      method: 'get',
      querySchema: QuerySchema,
      authorize: true,
      allowedRoles: [RoleEnum.Admin], 
      responses: [
        { code: httpStatus.OK, desc: 'All Users list', schema: PaginatedResponseSchema(UserSchema) },
      ],
      functionName: UserFunctions.getAllUsers,
      basePath,
    },
    {
      name: 'Deactivate User',
      desc: 'Soft delete user by setting is_activated to false',
      path: '/:userId',
      method: 'delete',
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      params: [{ name: 'userId', in: 'path', type: 'string', required: true }],
      responses: [
        { code: httpStatus.OK, desc: 'User deactivated' },
      ],
      functionName: UserFunctions.deactivateUser,
      basePath,
    },
  ];

  const userControllerFunctions: Record<UserFunctions, RequestHandler> = {
    searchUsers: userController.searchUsers as RequestHandler,
    getAllUsers: userController.getAllUsers as RequestHandler,
    deactivateUser: userController.deactivateUser as RequestHandler,
  };

  const router = Router();
  registerEndpointRoutes(router, endpointsMeta, userControllerFunctions);
  return router;
};

export default createUserRoute;
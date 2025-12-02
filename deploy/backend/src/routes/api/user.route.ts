import { userController } from 'controllers';
import { EndpointMeta } from 'docs/swagger';
import { Router, RequestHandler } from 'express';
import httpStatus from 'http-status';
import registerEndpointRoutes from 'routes/registerEndpointRoutes';
import { SearchUsersResponseSchema } from 'types/zod/user.schema';
import { RoleEnum } from '../../../../shared/auth.types';

enum UserFunctions {
  searchUsers = 'searchUsers',
  getAllUsers = 'getAllUsers', 
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
      authorize: true,
      allowedRoles: [RoleEnum.Admin], 
      responses: [
    
        { code: httpStatus.OK, desc: 'All Users list', schema: SearchUsersResponseSchema },
      ],
      functionName: UserFunctions.getAllUsers,
      basePath,
    },
  ];

  const userControllerFunctions: Record<UserFunctions, RequestHandler> = {
    searchUsers: userController.searchUsers as RequestHandler,
    getAllUsers: userController.getAllUsers as RequestHandler, 
  };

  const router = Router();
  registerEndpointRoutes(router, endpointsMeta, userControllerFunctions);
  return router;
};

export default createUserRoute;
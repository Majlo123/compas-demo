import { userController } from 'controllers';
import { EndpointMeta } from 'docs/swagger';
import { Router, RequestHandler } from 'express';
import httpStatus from 'http-status';
import registerEndpointRoutes from 'routes/registerEndpointRoutes';
import { SearchUsersResponseSchema, UserSchema, InviteUsersBodySchema, InviteUsersResponseSchema } from 'types/zod/user.schema';
import { QuerySchema, PaginatedResponseSchema } from 'types/zod/shared.schema';
import { RoleEnum } from '../../../../shared/auth.types';

enum UserFunctions {
  searchUsers = 'searchUsers',
  getAllUsers = 'getAllUsers',
  deactivateUser = 'deactivateUser',
  getUserProfile = 'getUserProfile',
  inviteUsers = 'inviteUsers',
  updateEmailNotificationPreference = 'updateEmailNotificationPreference',
  updateUserVacationDays = 'updateUserVacationDays',
  getUserVacationDays = 'getUserVacationDays',
  distributeAnnualLeave = 'distributeAnnualLeave',
  uploadProfileImage = 'uploadProfileImage',
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
      name: 'Get User Profile',
      desc: 'Get current user profile with vacation days information',
      path: '/profile',
      method: 'get',
      authorize: true,
      responses: [
        { code: httpStatus.OK, desc: 'User profile' },
      ],
      functionName: UserFunctions.getUserProfile,
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
    {
      name: 'Invite Users',
      desc: 'Send invitation emails to multiple users',
      path: '/invite',
      method: 'post',
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      requestBodySchema: InviteUsersBodySchema,
      responses: [
        { code: httpStatus.OK, desc: 'Invitation results', schema: InviteUsersResponseSchema },
      ],
      functionName: UserFunctions.inviteUsers,
      basePath,
    },
    {
      name: 'Distribute Annual Leave',
      desc: 'Add vacation days to all active users',
      path: '/distribute-vacation-days',
      method: 'post',
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      responses: [
        { code: httpStatus.OK, desc: 'Vacation days distributed successfully' },
      ],
      functionName: UserFunctions.distributeAnnualLeave,
      basePath,
    },
    {
      name: 'Update Email Notification Preference',
      desc: 'Update user email notification preference',
      path: '/email-notification-preference',
      method: 'put',
      authorize: true,
      responses: [
        { code: httpStatus.OK, desc: 'Email notification preference updated' },
      ],
      functionName: UserFunctions.updateEmailNotificationPreference,
      basePath,
    },
    {
      name: 'Update User Vacation Days',
      desc: 'Update vacation days for a user (Admin or Team Manager only)',
      path: '/:userId/vacation-days',
      method: 'put',
      authorize: true,
      params: [{ name: 'userId', in: 'path', type: 'string', required: true }],
      responses: [
        { code: httpStatus.OK, desc: 'Vacation days updated successfully' },
        { code: httpStatus.FORBIDDEN, desc: 'No permission to update this user' },
      ],
      functionName: UserFunctions.updateUserVacationDays,
      basePath,
    },
    {
      name: 'Get User Vacation Days',
      desc: 'Get vacation days information for a user',
      path: '/:userId/vacation-days',
      method: 'get',
      authorize: true,
      params: [{ name: 'userId', in: 'path', type: 'string', required: true }],
      responses: [
        { code: httpStatus.OK, desc: 'User vacation days information' },
      ],
      functionName: UserFunctions.getUserVacationDays,
      basePath,
    },
    {
      name: 'Upload Profile Image',
      desc: 'Upload and save profile image for the authenticated user',
      path: '/profile-image',
      method: 'post',
      authorize: true,
      responses: [
        { code: httpStatus.OK, desc: 'Profile image uploaded successfully' },
      ],
      functionName: UserFunctions.uploadProfileImage,
      basePath,
    },
  ];

  console.log('Available userController functions:', Object.keys(userController));

  const userControllerFunctions: Record<UserFunctions, RequestHandler> = {
    searchUsers: userController.searchUsers as RequestHandler,
    getAllUsers: userController.getAllUsers as RequestHandler,
    deactivateUser: userController.deactivateUser as RequestHandler,
    getUserProfile: userController.getUserProfile as RequestHandler,
    inviteUsers: userController.inviteUsers as RequestHandler,
    updateEmailNotificationPreference: userController.updateEmailNotificationPreference as RequestHandler,
    updateUserVacationDays: userController.updateUserVacationDays as RequestHandler,
    getUserVacationDays: userController.getUserVacationDays as RequestHandler,
    distributeAnnualLeave: userController.distributeAnnualLeave as RequestHandler,
    uploadProfileImage: userController.uploadProfileImage as RequestHandler,
  };

  const router = Router();
  registerEndpointRoutes(router, endpointsMeta, userControllerFunctions);
  return router;
};

export default createUserRoute;
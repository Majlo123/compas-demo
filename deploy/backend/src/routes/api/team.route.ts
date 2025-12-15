import { teamController } from 'controllers';
import { EndpointMeta } from 'docs/swagger';
import { Router, RequestHandler } from 'express';
import httpStatus from 'http-status';
import { RoleEnum } from '../../../../shared/auth.types';

import registerEndpointRoutes from 'routes/registerEndpointRoutes';
import {
  CreateTeamBodySchema,
  CreateTeamSuccessSchema,
  TeamListSchema,
  TeamSchema,
  CreateTeamMemberSuccessSchema,
  BulkAddTeamMembersSchema,
  BulkRemoveTeamMembersSchema,
  BulkUpdateTeamMembersManagerSchema,
} from 'types/zod/team.schema';
import {
  NotFoundResponseSchema,
  BadRequestResponseSchema,
  UnauthorizedResponseSchema,
  QuerySchema,
} from 'types/zod/shared.schema';

enum TeamFunctions {
  create = 'createTeam',
  findById = 'getTeam',
  findAll = 'listTeams',
  findByUserId = 'listTeamsByUserId',
  delete = 'deleteTeam',
  listMembers = 'listMembers',
  bulkAddMembers = 'bulkAddMembers',
  bulkRemoveMembers = 'bulkRemoveMembers',
  bulkUpdateMembersManager = 'bulkUpdateMembersManager',
  removeManagerRole = 'removeManagerRole',
  listUnassigned = 'listUnassignedTeams',
}

const createTeamRoute = (basePath: string): Router => {
  const endpointsMeta: EndpointMeta[] = [
    {
      name: 'Create Team',
      desc: 'Create a new team',
      path: '/',
      method: 'post',
      requestBodySchema: CreateTeamBodySchema,
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      responses: [
        {
          code: httpStatus.CREATED,
          desc: 'Team created',
          schema: CreateTeamSuccessSchema,
        },
        { code: httpStatus.BAD_REQUEST, desc: 'Invalid object format', schema: BadRequestResponseSchema },
      ],
      functionName: TeamFunctions.create,
      basePath,
    },
    {
      name: 'List Teams',
      desc: 'List teams',
      path: '/',
      method: 'get',
      querySchema: QuerySchema,
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      responses: [
        { code: httpStatus.OK, desc: 'Teams list', schema: TeamListSchema },
        { code: httpStatus.UNAUTHORIZED, desc: 'Unauthorized', schema: UnauthorizedResponseSchema },
      ],
      functionName: TeamFunctions.findAll,
      basePath,
    },
    {
      name: 'List Unassigned Teams',
      desc: 'List teams not assigned to any client',
      path: '/unassigned',
      method: 'get',
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      responses: [
        { code: httpStatus.OK, desc: 'Unassigned teams list', schema: TeamListSchema },
        { code: httpStatus.UNAUTHORIZED, desc: 'Unauthorized', schema: UnauthorizedResponseSchema },
      ],
      functionName: TeamFunctions.listUnassigned,
      basePath,
    },
    {
      name: 'Get Team by ID',
      desc: 'Retrieve a team by ID',
      path: '/:id',
      params: [{ name: 'id' }],
      method: 'get',
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      responses: [
        { code: httpStatus.OK, desc: 'Team found', schema: TeamSchema },
        { code: httpStatus.NOT_FOUND, desc: 'Not found', schema: NotFoundResponseSchema },
      ],
      functionName: TeamFunctions.findById,
      basePath,
    },
    {
      name: 'Delete Team',
      desc: 'Delete a team by ID',
      path: '/:id',
      params: [{ name: 'id' }],
      method: 'delete',
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      responses: [
        { code: httpStatus.OK, desc: 'Team deleted', schema: CreateTeamSuccessSchema },
        { code: httpStatus.NOT_FOUND, desc: 'Not found', schema: NotFoundResponseSchema },
      ],
      functionName: TeamFunctions.delete,
      basePath,
    },
    {
      name: 'List Teams by User ID',
      desc: 'Get teams where user is a manager',
      path: '/user/:userId',
      params: [{ name: 'userId' }],
      method: 'get',
      authorize: true,
      allowedRoles: [RoleEnum.Admin, RoleEnum.Employee],
      responses: [
        { code: httpStatus.OK, desc: 'Teams list', schema: TeamListSchema },
        { code: httpStatus.UNAUTHORIZED, desc: 'Unauthorized', schema: UnauthorizedResponseSchema },
      ],
      functionName: TeamFunctions.findByUserId,
      basePath,
    },
    {
      name: 'List Team Members',
      desc: 'List members of a team',
      path: '/:teamId/members',
      params: [{ name: 'teamId' }],
      method: 'get',
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      responses: [
        { code: httpStatus.OK, desc: 'Members list', schema: CreateTeamMemberSuccessSchema },
        { code: httpStatus.NOT_FOUND, desc: 'Not found', schema: NotFoundResponseSchema },
      ],
      functionName: TeamFunctions.listMembers,
      basePath,
    },
    {
      name: 'Bulk Add Team Members',
      desc: 'Add multiple members to team',
      path: '/:teamId/members/bulk',
      params: [{ name: 'teamId' }],
      method: 'post',
      requestBodySchema: BulkAddTeamMembersSchema,
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      responses: [
        { code: httpStatus.CREATED, desc: 'Members added', schema: CreateTeamMemberSuccessSchema },
        { code: httpStatus.BAD_REQUEST, desc: 'Invalid object format', schema: BadRequestResponseSchema },
      ],
      functionName: TeamFunctions.bulkAddMembers,
      basePath,
    },
    {
      name: 'Bulk Remove Team Members',
      desc: 'Remove multiple members from team',
      path: '/:teamId/members/bulk',
      params: [{ name: 'teamId' }],
      method: 'delete',
      requestBodySchema: BulkRemoveTeamMembersSchema,
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      responses: [
        { code: httpStatus.OK, desc: 'Members removed', schema: CreateTeamMemberSuccessSchema },
        { code: httpStatus.NOT_FOUND, desc: 'Not found', schema: NotFoundResponseSchema },
      ],
      functionName: TeamFunctions.bulkRemoveMembers,
      basePath,
    },
    {
      name: 'Bulk Update Team Members Manager Status',
      desc: 'Update manager status for multiple members',
      path: '/:teamId/members/bulk',
      params: [{ name: 'teamId' }],
      method: 'patch',
      requestBodySchema: BulkUpdateTeamMembersManagerSchema,
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      responses: [
        { code: httpStatus.OK, desc: 'Members updated', schema: CreateTeamMemberSuccessSchema },
        { code: httpStatus.NOT_FOUND, desc: 'Not found', schema: NotFoundResponseSchema },
      ],
      functionName: TeamFunctions.bulkUpdateMembersManager,
      basePath,
    },
    {
      name: 'Remove Manager Role from Members',
      desc: 'Remove manager role from members (Admin or Team Manager only)',
      path: '/:teamId/members/manager',
      params: [{ name: 'teamId' }],
      method: 'delete',
      requestBodySchema: BulkUpdateTeamMembersManagerSchema,
      authorize: true,
      allowedRoles: [RoleEnum.Admin, RoleEnum.Employee],
      responses: [
        { code: httpStatus.OK, desc: 'Manager role removed', schema: CreateTeamMemberSuccessSchema },
        { code: httpStatus.NOT_FOUND, desc: 'Not found', schema: NotFoundResponseSchema },
        { code: httpStatus.FORBIDDEN, desc: 'Unauthorized', schema: UnauthorizedResponseSchema },
      ],
      functionName: TeamFunctions.removeManagerRole,
      basePath,
    },
  ];

  const teamControllerFunctions: Record<TeamFunctions, RequestHandler> = {
    createTeam: teamController.createTeam as RequestHandler,
    getTeam: teamController.getTeam as RequestHandler,
    listTeams: teamController.listTeams as RequestHandler,
    listTeamsByUserId: teamController.listTeamsByUserId as RequestHandler,
    deleteTeam: teamController.deleteTeam as RequestHandler,
    listMembers: teamController.listMembers as RequestHandler,
    bulkAddMembers: teamController.bulkAddMembers as RequestHandler,
    bulkRemoveMembers: teamController.bulkRemoveMembers as RequestHandler,
    bulkUpdateMembersManager: teamController.bulkUpdateMembersManager as RequestHandler,
    removeManagerRole: teamController.removeManagerRole as RequestHandler,
    listUnassignedTeams: teamController.listUnassignedTeams as RequestHandler,
  };

  const router = Router();
  registerEndpointRoutes(router, endpointsMeta, teamControllerFunctions);
  return router;
};

export default createTeamRoute;

import { teamController } from 'controllers';
import { EndpointMeta } from 'docs/swagger';
import { Router, RequestHandler } from 'express';
import httpStatus from 'http-status';

import registerEndpointRoutes from 'routes/registerEndpointRoutes';
import {
  CreateTeamBodySchema,
  CreateTeamSuccessSchema,
  TeamListSchema,
  TeamSchema,
  CreateTeamMemberBodySchema,
  CreateTeamMemberSuccessSchema,
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
  delete = 'deleteTeam',
  addMember = 'addMember',
  removeMember = 'removeMember',
  listMembers = 'listMembers',
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
      allowedRoles: ['admin'],
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
      name: 'Get Team by ID',
      desc: 'Retrieve a team by ID',
      path: '/:id',
      params: [{ name: 'id' }],
      method: 'get',
      authorize: true,
      allowedRoles: ['admin'],
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
      allowedRoles: ['admin'],
      responses: [
        { code: httpStatus.OK, desc: 'Team deleted', schema: CreateTeamSuccessSchema },
        { code: httpStatus.NOT_FOUND, desc: 'Not found', schema: NotFoundResponseSchema },
      ],
      functionName: TeamFunctions.delete,
      basePath,
    },
    {
      name: 'List Teams',
      desc: 'List teams',
      path: '/',
      method: 'get',
      querySchema: QuerySchema,
      authorize: true,
      allowedRoles: ['admin'],
      responses: [
        { code: httpStatus.OK, desc: 'Teams list', schema: TeamListSchema },
        { code: httpStatus.UNAUTHORIZED, desc: 'Unauthorized', schema: UnauthorizedResponseSchema },
      ],
      functionName: TeamFunctions.findAll,
      basePath,
    },
    {
      name: 'Add Team Member',
      desc: 'Add member to team',
      path: '/:teamId/members',
      params: [{ name: 'teamId' }],
      method: 'post',
      requestBodySchema: CreateTeamMemberBodySchema,
      authorize: true,
      allowedRoles: ['admin'],
      responses: [
        { code: httpStatus.CREATED, desc: 'Member added', schema: CreateTeamMemberSuccessSchema },
        { code: httpStatus.BAD_REQUEST, desc: 'Invalid object format', schema: BadRequestResponseSchema },
      ],
      functionName: TeamFunctions.addMember,
      basePath,
    },
    {
      name: 'Remove Team Member',
      desc: 'Remove member from team',
      path: '/:teamId/members/:userId',
      params: [{ name: 'teamId' }, { name: 'userId' }],
      method: 'delete',
      authorize: true,
      allowedRoles: ['admin'],
      responses: [
        { code: httpStatus.OK, desc: 'Member removed', schema: CreateTeamMemberSuccessSchema },
        { code: httpStatus.NOT_FOUND, desc: 'Not found', schema: NotFoundResponseSchema },
      ],
      functionName: TeamFunctions.removeMember,
      basePath,
    },
    {
      name: 'List Team Members',
      desc: 'List members of a team',
      path: '/:teamId/members',
      params: [{ name: 'teamId' }],
      method: 'get',
      authorize: true,
      allowedRoles: ['admin'],
      responses: [
        { code: httpStatus.OK, desc: 'Members list', schema: CreateTeamMemberSuccessSchema },
        { code: httpStatus.NOT_FOUND, desc: 'Not found', schema: NotFoundResponseSchema },
      ],
      functionName: TeamFunctions.listMembers,
      basePath,
    },
  ];

  const teamControllerFunctions: Record<TeamFunctions, RequestHandler> = {
    createTeam: teamController.createTeam as RequestHandler,
    getTeam: teamController.getTeam as RequestHandler,
    listTeams: teamController.listTeams as RequestHandler,
    deleteTeam: teamController.deleteTeam as RequestHandler,
    addMember: teamController.addMember as RequestHandler,
    removeMember: teamController.removeMember as RequestHandler,
    listMembers: teamController.listMembers as RequestHandler,
  };

  const router = Router();
  registerEndpointRoutes(router, endpointsMeta, teamControllerFunctions);
  return router;
};

export default createTeamRoute;

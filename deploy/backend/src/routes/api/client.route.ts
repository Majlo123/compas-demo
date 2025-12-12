import { clientController } from 'controllers';
import { EndpointMeta } from 'docs/swagger';
import { Router } from 'express';
import httpStatus from 'http-status';
import { RoleEnum } from '../../../../shared/auth.types';
import registerEndpointRoutes from 'routes/registerEndpointRoutes';
import {
  ClientListSchema,
  ClientSchema,
  CreateClientBodySchema,
  UpdateClientBodySchema,
  ClientsQuerySchema,
} from 'types/zod/client.schema';
import {
  NotFoundResponseSchema,
  BadRequestResponseSchema,
  UnauthorizedResponseSchema,
} from 'types/zod/shared.schema';

enum ClientFunctions {
  list = 'listClients',
  get = 'getClient',
  create = 'createClient',
  update = 'updateClient',
  projects = 'listClientProjects',
}

const createClientRoute = (basePath: string): Router => {
  const endpointsMeta: EndpointMeta[] = [
    {
      name: 'List Clients',
      desc: 'List clients',
      path: '/',
      method: 'get',
      querySchema: ClientsQuerySchema,
      authorize: true,
      allowedRoles: [RoleEnum.Admin, RoleEnum.Employee],
      responses: [
        { code: httpStatus.OK, desc: 'Clients list', schema: ClientListSchema },
        { code: httpStatus.UNAUTHORIZED, desc: 'Unauthorized', schema: UnauthorizedResponseSchema },
      ],
      functionName: ClientFunctions.list,
      basePath,
    },
    {
      name: 'Get Client',
      desc: 'Get client by id',
      path: '/:id',
      params: [{ name: 'id' }],
      method: 'get',
      authorize: true,
      allowedRoles: [RoleEnum.Admin, RoleEnum.Employee],
      responses: [
        { code: httpStatus.OK, desc: 'Client found', schema: ClientSchema },
        { code: httpStatus.NOT_FOUND, desc: 'Not found', schema: NotFoundResponseSchema },
      ],
      functionName: ClientFunctions.get,
      basePath,
    },
    {
      name: 'List Client Projects',
      desc: 'List projects for a client',
      path: '/:id/projects',
      params: [{ name: 'id' }],
      method: 'get',
      authorize: true,
      allowedRoles: [RoleEnum.Admin, RoleEnum.Employee],
      responses: [
        { code: httpStatus.OK, desc: 'Projects list', schema: ClientSchema.optional() },
        { code: httpStatus.NOT_FOUND, desc: 'Not found', schema: NotFoundResponseSchema },
      ],
      functionName: ClientFunctions.projects,
      basePath,
    },
    {
      name: 'Create Client',
      desc: 'Create a new client',
      path: '/',
      method: 'post',
      requestBodySchema: CreateClientBodySchema,
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      responses: [
        { code: httpStatus.CREATED, desc: 'Client created', schema: ClientSchema },
        { code: httpStatus.BAD_REQUEST, desc: 'Invalid object format', schema: BadRequestResponseSchema },
      ],
      functionName: ClientFunctions.create,
      basePath,
    },
    {
      name: 'Update Client',
      desc: 'Update a client',
      path: '/:id',
      params: [{ name: 'id' }],
      method: 'put',
      requestBodySchema: UpdateClientBodySchema,
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      responses: [
        { code: httpStatus.OK, desc: 'Client updated', schema: ClientSchema },
        { code: httpStatus.NOT_FOUND, desc: 'Not found', schema: NotFoundResponseSchema },
      ],
      functionName: ClientFunctions.update,
      basePath,
    },
  ];

  const controllerFunctions = {
    [ClientFunctions.list]: clientController.listClients,
    [ClientFunctions.get]: clientController.getClient,
    [ClientFunctions.create]: clientController.createClient,
    [ClientFunctions.update]: clientController.updateClient,
    [ClientFunctions.projects]: clientController.listClientProjects,
  };

  const router = Router();
  registerEndpointRoutes(router, endpointsMeta, controllerFunctions);
  return router;
};

export default createClientRoute;

import { organizationController } from 'controllers';
import { EndpointMeta } from 'docs/swagger';
import { Router, RequestHandler } from 'express';
import httpStatus from 'http-status';

import registerEndpointRoutes from 'routes/registerEndpointRoutes';
import {
  CreateOrganizationSchema,
  CreateOrganizationSuccessSchema,
  FindOrganizationByIdSuccessSchema,
  FindAllOrganizationsSuccessSchema,
  UpdateOrganizationSuccessSchema,
  DeleteOrganizationSuccessSchema,
} from 'types/zod/organization.schema';
import {
  NotFoundResponseSchema,
  BadRequestResponseSchema,
  ForbiddenResponseSchema,
  UnauthorizedResponseSchema,
  QuerySchema,
} from 'types/zod/shared.schema';

enum OrganizationFunctions {
  create = 'create',
  findById = 'findById',
  findAll = 'findAll',
  updateById = 'updateById',
  deleteById = 'deleteById',
}

const createOrganizationRoute = (basePath: string): Router => {
  const endpointsMeta: EndpointMeta[] = [
    {
      name: 'Create Organization',
      desc: 'Create a new organization',
      path: '/',
      method: 'post',
      requestBodySchema: CreateOrganizationSchema,
      responses: [
        {
          code: httpStatus.CREATED,
          desc: 'Organization created',
          schema: CreateOrganizationSuccessSchema,
        },
        { code: httpStatus.FORBIDDEN, desc: 'Unauthorized', schema: ForbiddenResponseSchema },
        {
          code: httpStatus.BAD_REQUEST,
          desc: 'Invalid object format',
          schema: BadRequestResponseSchema,
        },
      ],
      functionName: OrganizationFunctions.create,
      basePath,
    },
    {
      name: 'Find Organization by ID',
      desc: 'Retrieve an organization by its ID',
      path: '/:id',
      params: [{ name: 'id' }],
      method: 'get',
      responses: [
        {
          code: httpStatus.OK,
          desc: 'Organization found',
          schema: FindOrganizationByIdSuccessSchema,
        },
        { code: httpStatus.NOT_FOUND, desc: 'Not found', schema: NotFoundResponseSchema },
      ],
      functionName: OrganizationFunctions.findById,
      basePath,
    },
    {
      name: 'Find All Organizations',
      desc: 'Retrieve all organizations',
      path: '/',
      method: 'get',
      querySchema: QuerySchema,
      responses: [
        {
          code: httpStatus.OK,
          desc: 'List of organizations',
          schema: FindAllOrganizationsSuccessSchema,
        },
        { code: httpStatus.UNAUTHORIZED, desc: 'Unauthorized', schema: UnauthorizedResponseSchema },
      ],
      functionName: OrganizationFunctions.findAll,
      basePath,
    },
    {
      name: 'Update Organization',
      desc: 'Update an existing organization',
      path: '/:id',
      params: [{ name: 'id' }],
      method: 'put',
      requestBodySchema: CreateOrganizationSchema,
      responses: [
        {
          code: httpStatus.OK,
          desc: 'Organization updated',
          schema: UpdateOrganizationSuccessSchema,
        },
        { code: httpStatus.FORBIDDEN, desc: 'Unauthorized', schema: ForbiddenResponseSchema },
        {
          code: httpStatus.BAD_REQUEST,
          desc: 'Invalid object format',
          schema: BadRequestResponseSchema,
        },
        { code: httpStatus.NOT_FOUND, desc: 'Not found', schema: NotFoundResponseSchema },
      ],
      functionName: OrganizationFunctions.updateById,
      basePath,
    },
    {
      name: 'Delete Organization',
      desc: 'Delete an organization',
      path: '/:id',
      params: [{ name: 'id' }],
      method: 'delete',
      responses: [
        {
          code: httpStatus.OK,
          desc: 'Organization deleted',
          schema: DeleteOrganizationSuccessSchema,
        },
        { code: httpStatus.FORBIDDEN, desc: 'Unauthorized', schema: ForbiddenResponseSchema },
        { code: httpStatus.NOT_FOUND, desc: 'Not found', schema: NotFoundResponseSchema },
      ],
      functionName: OrganizationFunctions.deleteById,
      basePath,
    },
  ];

  const organizationControllerFunctions: Record<OrganizationFunctions, RequestHandler> = {
    findById: organizationController.findById,
    create: organizationController.create,
    findAll: organizationController.findAll,
    updateById: organizationController.updateById,
    deleteById: organizationController.deleteById,
  };

  const router = Router();
  registerEndpointRoutes(router, endpointsMeta, organizationControllerFunctions);
  return router;
};

export default createOrganizationRoute;

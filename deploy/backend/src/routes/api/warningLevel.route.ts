import * as warningLevelController from 'controllers/warningLevel.controller';
import { EndpointMeta } from 'docs/swagger';
import { Router, RequestHandler } from 'express';
import httpStatus from 'http-status';
import registerEndpointRoutes from 'routes/registerEndpointRoutes';
import {
  WarningLevelSchema,
  CreateWarningLevelSchema,
  UpdateWarningLevelSchema,
  SearchWarningLevelResponseSchema,
  GetWarningLevelResponseSchema,
  CreateWarningLevelResponseSchema,
} from 'types/zod/warningLevel.schema';
import { RoleEnum } from '../../../../shared/auth.types';

enum WarningLevelFunctions {
  searchWarningLevels = 'searchWarningLevels',
  getAllWarningLevels = 'getAllWarningLevels',
  getWarningLevelById = 'getWarningLevelById',
  createWarningLevel = 'createWarningLevel',
  updateWarningLevel = 'updateWarningLevel',
  deleteWarningLevel = 'deleteWarningLevel',
}

const createWarningLevelRoute = (basePath: string): Router => {
  const endpointsMeta: EndpointMeta[] = [
    {
      name: 'Search Warning Levels',
      desc: 'Search warning levels by name or description',
      path: '/search',
      method: 'get',
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      responses: [
        { code: httpStatus.OK, desc: 'Warning levels list', schema: SearchWarningLevelResponseSchema },
      ],
      functionName: WarningLevelFunctions.searchWarningLevels,
      basePath,
    },
    {
      name: 'Get All Warning Levels',
      desc: 'Get list of all warning levels ordered by level',
      path: '/',
      method: 'get',
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      responses: [
        { code: httpStatus.OK, desc: 'All warning levels', schema: SearchWarningLevelResponseSchema },
      ],
      functionName: WarningLevelFunctions.getAllWarningLevels,
      basePath,
    },
    {
      name: 'Get Warning Level By ID',
      desc: 'Get a specific warning level by ID',
      path: '/:id',
      method: 'get',
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      params: [{ name: 'id', in: 'path', type: 'string', required: true }],
      responses: [
        { code: httpStatus.OK, desc: 'Warning level details', schema: GetWarningLevelResponseSchema },
        { code: httpStatus.NOT_FOUND, desc: 'Warning level not found' },
      ],
      functionName: WarningLevelFunctions.getWarningLevelById,
      basePath,
    },
    {
      name: 'Create Warning Level',
      desc: 'Create a new warning level configuration',
      path: '/',
      method: 'post',
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      requestBodySchema: CreateWarningLevelSchema,
      responses: [
        { code: httpStatus.CREATED, desc: 'Warning level created', schema: CreateWarningLevelResponseSchema },
        { code: httpStatus.BAD_REQUEST, desc: 'Invalid input data' },
        { code: httpStatus.CONFLICT, desc: 'Warning level with same name already exists' },
      ],
      functionName: WarningLevelFunctions.createWarningLevel,
      basePath,
    },
    {
      name: 'Update Warning Level',
      desc: 'Update an existing warning level',
      path: '/:id',
      method: 'put',
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      params: [{ name: 'id', in: 'path', type: 'string', required: true }],
      requestBodySchema: UpdateWarningLevelSchema,
      responses: [
        { code: httpStatus.OK, desc: 'Warning level updated', schema: GetWarningLevelResponseSchema },
        { code: httpStatus.BAD_REQUEST, desc: 'Invalid input data' },
        { code: httpStatus.NOT_FOUND, desc: 'Warning level not found' },
        { code: httpStatus.CONFLICT, desc: 'Warning level with same name already exists' },
      ],
      functionName: WarningLevelFunctions.updateWarningLevel,
      basePath,
    },
    {
      name: 'Delete Warning Level',
      desc: 'Delete a warning level',
      path: '/:id',
      method: 'delete',
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      params: [{ name: 'id', in: 'path', type: 'string', required: true }],
      responses: [
        { code: httpStatus.OK, desc: 'Warning level deleted' },
        { code: httpStatus.NOT_FOUND, desc: 'Warning level not found' },
      ],
      functionName: WarningLevelFunctions.deleteWarningLevel,
      basePath,
    },
  ];

  const warningLevelControllerFunctions: Record<WarningLevelFunctions, RequestHandler> = {
    searchWarningLevels: warningLevelController.searchWarningLevels as RequestHandler,
    getAllWarningLevels: warningLevelController.getAllWarningLevels as RequestHandler,
    getWarningLevelById: warningLevelController.getWarningLevelById as RequestHandler,
    createWarningLevel: warningLevelController.createWarningLevel as RequestHandler,
    updateWarningLevel: warningLevelController.updateWarningLevel as RequestHandler,
    deleteWarningLevel: warningLevelController.deleteWarningLevel as RequestHandler,
  };

  const router = Router();
  registerEndpointRoutes(router, endpointsMeta, warningLevelControllerFunctions);
  return router;
};

export default createWarningLevelRoute;

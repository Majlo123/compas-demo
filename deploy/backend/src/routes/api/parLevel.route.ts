import * as parLevelController from 'controllers/parLevel.controller';
import { EndpointMeta } from 'docs/swagger';
import { Router, RequestHandler } from 'express';
import httpStatus from 'http-status';
import registerEndpointRoutes from 'routes/registerEndpointRoutes';
import {
  CreateParLevelSchema,
  UpdateParLevelSchema,
  GetParLevelResponseSchema,
  CreateParLevelResponseSchema,
} from 'types/zod/parLevel.schema';
import { RoleEnum } from '../../../../shared/auth.types';

enum ParLevelFunctions {
  getAllParLevels = 'getAllParLevels',
  getParLevelByProdId = 'getParLevelByProdId',
  getParLevelsByWarningLevel = 'getParLevelsByWarningLevel',
  createParLevel = 'createParLevel',
  updateParLevel = 'updateParLevel',
  deleteParLevel = 'deleteParLevel',
}

const createParLevelRoute = (basePath: string): Router => {
  const endpointsMeta: EndpointMeta[] = [
    {
      name: 'Get All PAR Levels',
      desc: 'Retrieve all PAR level configurations. Supports filtering by commodity groups.',
      path: '/',
      method: 'get',
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      params: [
        {
          name: 'commodityGroups',
          in: 'query',
          type: 'array',
          items: { type: 'string' },
          required: false,
          description: 'Filter by commodity group names (e.g., CRISPS AND SNACKS, ALCOHOLIC BEVERAGE). Multiple values can be provided.',
        },
      ],
      responses: [
        { code: httpStatus.OK, desc: 'All PAR levels', schema: GetParLevelResponseSchema },
      ],
      functionName: ParLevelFunctions.getAllParLevels,
      basePath,
    },
    {
      name: 'Get PAR Levels by Warning Level',
      desc: 'Retrieve all PAR levels associated with a specific warning level',
      path: '/warning-level/:warningLevelId',
      method: 'get',
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      params: [{ name: 'warningLevelId', in: 'path', type: 'string', required: true }],
      responses: [
        {
          code: httpStatus.OK,
          desc: 'PAR levels for warning level',
          schema: GetParLevelResponseSchema,
        },
        { code: httpStatus.NOT_FOUND, desc: 'Warning level not found' },
      ],
      functionName: ParLevelFunctions.getParLevelsByWarningLevel,
      basePath,
    },
    {
      name: 'Get PAR Level by Product ID',
      desc: 'Retrieve PAR level configuration for a specific product',
      path: '/:prodId',
      method: 'get',
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      params: [{ name: 'prodId', in: 'path', type: 'string', required: true }],
      responses: [
        { code: httpStatus.OK, desc: 'PAR level details', schema: GetParLevelResponseSchema },
        { code: httpStatus.NOT_FOUND, desc: 'PAR level not found' },
      ],
      functionName: ParLevelFunctions.getParLevelByProdId,
      basePath,
    },
    {
      name: 'Create PAR Level',
      desc: 'Create a new PAR level configuration for a product. Product must exist in live_stock. One PAR level per product is enforced. Threshold must be a non-negative integer.',
      path: '/',
      method: 'post',
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      requestBodySchema: CreateParLevelSchema,
      requestBodyExample: {
        prodId: '100806',
        threshold: 10,
        warningLevelId: '123e4567-e89b-12d3-a456-426614174000',
      },
      responses: [
        {
          code: httpStatus.CREATED,
          desc: 'PAR level created',
          schema: CreateParLevelResponseSchema,
        },
        {
          code: httpStatus.BAD_REQUEST,
          desc: 'Invalid input data or product not found in live_stock',
        },
        { code: httpStatus.CONFLICT, desc: 'PAR level already exists for this product' },
      ],
      functionName: ParLevelFunctions.createParLevel,
      basePath,
    },
    {
      name: 'Update PAR Level',
      desc: 'Update an existing PAR level configuration. Threshold must be a non-negative integer if provided.',
      path: '/:prodId',
      method: 'patch',
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      params: [{ name: 'prodId', in: 'path', type: 'string', required: true }],
      requestBodySchema: UpdateParLevelSchema,
      requestBodyExample: {
        threshold: 15,
        warningLevelId: '123e4567-e89b-12d3-a456-426614174001',
      },
      responses: [
        { code: httpStatus.OK, desc: 'PAR level updated', schema: CreateParLevelResponseSchema },
        { code: httpStatus.BAD_REQUEST, desc: 'Invalid input data' },
        { code: httpStatus.NOT_FOUND, desc: 'PAR level not found' },
      ],
      functionName: ParLevelFunctions.updateParLevel,
      basePath,
    },
    {
      name: 'Delete PAR Level',
      desc: 'Delete a PAR level configuration for a specific product',
      path: '/:prodId',
      method: 'delete',
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      params: [{ name: 'prodId', in: 'path', type: 'string', required: true }],
      responses: [
        { code: httpStatus.OK, desc: 'PAR level deleted' },
        { code: httpStatus.NOT_FOUND, desc: 'PAR level not found' },
      ],
      functionName: ParLevelFunctions.deleteParLevel,
      basePath,
    },
  ];

  const parLevelControllerFunctions: Record<ParLevelFunctions, RequestHandler> = {
    getAllParLevels: parLevelController.getAllParLevels as RequestHandler,
    getParLevelByProdId: parLevelController.getParLevelByProdId as RequestHandler,
    getParLevelsByWarningLevel: parLevelController.getParLevelsByWarningLevel as RequestHandler,
    createParLevel: parLevelController.createParLevel as RequestHandler,
    updateParLevel: parLevelController.updateParLevel as RequestHandler,
    deleteParLevel: parLevelController.deleteParLevel as RequestHandler,
  };

  const router = Router();
  registerEndpointRoutes(router, endpointsMeta, parLevelControllerFunctions);
  return router;
};

export default createParLevelRoute;

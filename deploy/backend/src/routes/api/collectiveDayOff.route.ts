import { collectiveDayOffController } from 'controllers';
import { EndpointMeta } from 'docs/swagger';
import { Router, RequestHandler } from 'express';
import httpStatus from 'http-status';
import registerEndpointRoutes from 'routes/registerEndpointRoutes';
import { RoleEnum } from '../../../../shared/auth.types';
import { z } from 'zod';

enum CollectiveDayOffFunctions {
  getAllCollectiveDaysOff = 'getAllCollectiveDaysOff',
  getCollectiveDaysOffByDateRange = 'getCollectiveDaysOffByDateRange',
  createCollectiveDayOff = 'createCollectiveDayOff',
  deleteCollectiveDayOff = 'deleteCollectiveDayOff',
}

const DateRangeQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

const CreateCollectiveDayOffSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').default('2026-08-01'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').default('2026-08-15'),
  description: z.string().min(1, 'Description is required').default('Summer Break - Company-wide summer vacation period'),
});

const createCollectiveDayOffRoute = (basePath: string): Router => {
  const endpointsMeta: EndpointMeta[] = [
    {
      name: 'Get All Collective Days Off',
      desc: 'Get all collective days off (company holidays)',
      path: '/',
      method: 'get',
      authorize: true,
      responses: [
        { code: httpStatus.OK, desc: 'List of collective days off' },
      ],
      functionName: CollectiveDayOffFunctions.getAllCollectiveDaysOff,
      basePath,
    },
    {
      name: 'Get Collective Days Off By Date Range',
      desc: 'Get collective days off within a specific date range',
      path: '/by-date-range',
      method: 'get',
      authorize: true,
      querySchema: DateRangeQuerySchema,
      responses: [
        { code: httpStatus.OK, desc: 'List of collective days off in date range' },
      ],
      functionName: CollectiveDayOffFunctions.getCollectiveDaysOffByDateRange,
      basePath,
    },
    {
      name: 'Create Collective Day Off',
      desc: 'Create a new collective day off entry (Admin only)',
      path: '/',
      method: 'post',
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      requestBodySchema: CreateCollectiveDayOffSchema,
      responses: [
        { code: httpStatus.CREATED, desc: 'Collective day off created successfully' },
        { code: httpStatus.BAD_REQUEST, desc: 'Invalid request data' },
        { code: httpStatus.CONFLICT, desc: 'Duplicate date range' },
      ],
      functionName: CollectiveDayOffFunctions.createCollectiveDayOff,
      basePath,
    },
    {
      name: 'Delete Collective Day Off',
      desc: 'Delete a collective day off entry (Admin only)',
      path: '/:id',
      params: [{ name: 'id' }],
      method: 'delete',
      authorize: true,
      allowedRoles: [RoleEnum.Admin],
      responses: [
        { code: httpStatus.OK, desc: 'Collective day off deleted successfully' },
        { code: httpStatus.NOT_FOUND, desc: 'Collective day off not found' },
      ],
      functionName: CollectiveDayOffFunctions.deleteCollectiveDayOff,
      basePath,
    },
  ];

  const collectiveDayOffControllerFunctions: Record<CollectiveDayOffFunctions, RequestHandler> = {
    getAllCollectiveDaysOff: collectiveDayOffController.getAllCollectiveDaysOff as RequestHandler,
    getCollectiveDaysOffByDateRange: collectiveDayOffController.getCollectiveDaysOffByDateRange as RequestHandler,
    createCollectiveDayOff: collectiveDayOffController.createCollectiveDayOff as RequestHandler,
    deleteCollectiveDayOff: collectiveDayOffController.deleteCollectiveDayOff as RequestHandler,
  };

  const router = Router();
  registerEndpointRoutes(router, endpointsMeta, collectiveDayOffControllerFunctions);
  return router;
};

export default createCollectiveDayOffRoute;

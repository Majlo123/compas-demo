import { timeEntryController } from 'controllers';
import { EndpointMeta, registerSwaggerSchema } from 'docs/swagger';
import { Router, RequestHandler } from 'express';
import httpStatus from 'http-status';
import registerEndpointRoutes from 'routes/registerEndpointRoutes';
import { RoleEnum } from '../../../../shared/auth.types';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

enum TimeEntryFunctions {
  createTimeEntry = 'createTimeEntry',
  getUserTimeEntries = 'getUserTimeEntries',
  getTimeEntryById = 'getTimeEntryById',
  updateTimeEntry = 'updateTimeEntry',
  deleteTimeEntry = 'deleteTimeEntry',
}

const TimeEntryQuerySchema = z.object({
  startDate: z.string().optional().openapi({ description: 'Start date filter (YYYY-MM-DD)', example: '2025-12-01' }),
  endDate: z.string().optional().openapi({ description: 'End date filter (YYYY-MM-DD)', example: '2025-12-31' }),
});

const createTimeEntryRoute = (basePath: string): Router => {
  const CreateTimeEntrySchema = z
    .object({
      projectName: z.string().min(1, 'Project name is required'),
      description: z.string().optional(),
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
      timeSpentMinutes: z.number().int().positive('Time spent must be positive').max(480, 'Cannot exceed 480 minutes (8 hours)'),
      isOvertime: z.boolean().optional(),
      isBillable: z.boolean().optional(),
    })
    .openapi({
      description: 'Create a new time entry for the current user',
      example: {
        projectName: 'Website Redesign',
        description: 'Worked on frontend components and responsive design',
        startDate: '2025-12-16',
        timeSpentMinutes: 120,
        isOvertime: false,
        isBillable: true,
      },
    });
  registerSwaggerSchema('CreateTimeEntry', CreateTimeEntrySchema);

  const TimeEntrySchema = z
    .object({
      id: z.string().uuid(),
      userId: z.string().uuid(),
      projectName: z.string(),
      description: z.string().optional().nullable(),
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      timeSpentMinutes: z.number().int(),
      isOvertime: z.boolean(),
      createdAt: z.string().datetime().optional(),
    })
    .openapi({
      description: 'Time entry entity',
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        userId: '660e8400-e29b-41d4-a716-446655440001',
        projectName: 'Website Redesign',
        description: 'Worked on frontend components and responsive design',
        startDate: '2025-12-16',
        timeSpentMinutes: 120,
        isOvertime: false,
        createdAt: '2025-12-16T10:30:00Z',
      },
    });
  registerSwaggerSchema('TimeEntry', TimeEntrySchema);

  const UpdateTimeEntrySchema = z
    .object({
      projectName: z.string().optional(),
      description: z.string().optional(),
      timeSpentMinutes: z.number().int().positive().max(480).optional(),
      isOvertime: z.boolean().optional(),
      isBillable: z.boolean().optional(),
    })
    .openapi({
      description: 'Update a time entry (all fields optional)',
      example: {
        timeSpentMinutes: 180,
        isOvertime: true,
      },
    });
  registerSwaggerSchema('UpdateTimeEntry', UpdateTimeEntrySchema);

  const endpointsMeta: EndpointMeta[] = [
    {
      name: 'Create Time Entry',
      desc: 'Create a new time entry for the current user',
      path: '/',
      method: 'post',
      authorize: true,
      requestBodySchema: CreateTimeEntrySchema,
      responses: [
        { code: httpStatus.CREATED, desc: 'Time entry created successfully' },
        { code: httpStatus.BAD_REQUEST, desc: 'Invalid request data' },
        { code: httpStatus.UNAUTHORIZED, desc: 'Unauthorized' },
      ],
      functionName: TimeEntryFunctions.createTimeEntry,
      basePath,
    },
    {
      name: 'Get User Time Entries',
      desc: 'Get all time entries for the current user (with optional date range filter)',
      path: '/',
      method: 'get',
      authorize: true,
      querySchema: TimeEntryQuerySchema,
      responses: [
        { code: httpStatus.OK, desc: 'List of time entries' },
        { code: httpStatus.UNAUTHORIZED, desc: 'Unauthorized' },
      ],
      functionName: TimeEntryFunctions.getUserTimeEntries,
      basePath,
    },
    {
      name: 'Get Time Entry by ID',
      desc: 'Get a specific time entry by ID',
      path: '/:id',
      params: [{ name: 'id', description: 'Time entry ID' }],
      method: 'get',
      authorize: true,
      responses: [
        { code: httpStatus.OK, desc: 'Time entry found' },
        { code: httpStatus.NOT_FOUND, desc: 'Time entry not found' },
        { code: httpStatus.UNAUTHORIZED, desc: 'Unauthorized' },
      ],
      functionName: TimeEntryFunctions.getTimeEntryById,
      basePath,
    },
    {
      name: 'Update Time Entry',
      desc: 'Update a time entry (only owner can update)',
      path: '/:id',
      params: [{ name: 'id', description: 'Time entry ID' }],
      method: 'put',
      authorize: true,
      requestBodySchema: UpdateTimeEntrySchema,
      responses: [
        { code: httpStatus.OK, desc: 'Time entry updated successfully' },
        { code: httpStatus.BAD_REQUEST, desc: 'Invalid request data' },
        { code: httpStatus.FORBIDDEN, desc: 'Cannot update this time entry' },
        { code: httpStatus.NOT_FOUND, desc: 'Time entry not found' },
        { code: httpStatus.UNAUTHORIZED, desc: 'Unauthorized' },
      ],
      functionName: TimeEntryFunctions.updateTimeEntry,
      basePath,
    },
    {
      name: 'Delete Time Entry',
      desc: 'Delete a time entry (only owner can delete)',
      path: '/:id',
      params: [{ name: 'id', description: 'Time entry ID' }],
      method: 'delete',
      authorize: true,
      responses: [
        { code: httpStatus.OK, desc: 'Time entry deleted successfully' },
        { code: httpStatus.FORBIDDEN, desc: 'Cannot delete this time entry' },
        { code: httpStatus.NOT_FOUND, desc: 'Time entry not found' },
        { code: httpStatus.UNAUTHORIZED, desc: 'Unauthorized' },
      ],
      functionName: TimeEntryFunctions.deleteTimeEntry,
      basePath,
    },
  ];

  const timeEntryControllerFunctions: Record<TimeEntryFunctions, RequestHandler> = {
    createTimeEntry: timeEntryController.createTimeEntry as RequestHandler,
    getUserTimeEntries: timeEntryController.getUserTimeEntries as RequestHandler,
    getTimeEntryById: timeEntryController.getTimeEntryById as RequestHandler,
    updateTimeEntry: timeEntryController.updateTimeEntry as RequestHandler,
    deleteTimeEntry: timeEntryController.deleteTimeEntry as RequestHandler,
  };

  const router = Router();
  registerEndpointRoutes(router, endpointsMeta, timeEntryControllerFunctions);
  return router;
};

export default createTimeEntryRoute;

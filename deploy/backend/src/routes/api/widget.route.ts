import { widgetController } from 'controllers';
import { EndpointMeta } from 'docs/swagger';
import { Router, RequestHandler } from 'express';
import httpStatus from 'http-status';
import registerEndpointRoutes from 'routes/registerEndpointRoutes';
import { registerSwaggerSchema } from 'docs/swagger';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

enum WidgetFunctions {
  createWidget = 'createWidget',
  getWidget = 'getWidget',
  listWidgetsByUser = 'listWidgetsByUser',
  updateWidget = 'updateWidget',
  deleteWidget = 'deleteWidget',
  saveWidgetsLayout = 'saveWidgetsLayout',
  timeOffSummary = 'timeOffSummary',
}

const createWidgetRoute = (basePath: string): Router => {
  // Create schema does not accept `userId` in the body — it's taken from the path param
  const CreateWidgetSchema = z
    .object({
      x: z.number().int(),
      y: z.number().int(),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
      type: z.string(),
    })
    .openapi({
      description: 'Create a widget for the given user. `userId` is provided via the path parameter.',
      example: {
        x: 0,
        y: 0,
        width: 3,
        height: 2,
        type: 'team-calendar',
      },
    });
  registerSwaggerSchema('CreateWidget', CreateWidgetSchema);

  const WidgetSchema = z.object({
    id: z.string(),
    x: z.number().int(),
    y: z.number().int(),
    width: z.number().int(),
    height: z.number().int(),
    userId: z.string(),
    type: z.string(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  }).openapi({ description: 'Widget entity returned by the API' });
  registerSwaggerSchema('Widget', WidgetSchema);

  const TimeOffSummarySchema = z
    .object({
      totalDays: z.number().int().nonnegative(),
      breakdown: z.array(
        z.object({
          type: z.string(),
          days: z.number().int().nonnegative(),
        }),
      ),
    })
    .openapi({
      description: 'Approved leave days taken in the current month with per-type breakdown',
      example: {
        totalDays: 6,
        breakdown: [
          { type: 'vacation', days: 4 },
          { type: 'sick', days: 1 },
          { type: 'personal', days: 1 },
        ],
      },
    });
  registerSwaggerSchema('TimeOffSummary', TimeOffSummarySchema);

  const UpdateWidgetSchema = z
    .object({
      x: z.number().int().optional(),
      y: z.number().int().optional(),
      width: z.number().int().positive().optional(),
      height: z.number().int().positive().optional(),
      type: z.string().optional(),
    })
    .openapi({
      description: 'Partial widget fields to update (position, size, or type).',
      example: { x: 1, y: 2 },
    });
  registerSwaggerSchema('UpdateWidget', UpdateWidgetSchema);

  const SaveWidgetsLayoutSchema = z
    .object({
      widgets: z.array(
        z
          .object({
            id: z.string(),
            x: z.number().int(),
            y: z.number().int(),
            width: z.number().int().positive(),
            height: z.number().int().positive(),
          })
          .openapi({ example: { id: 'w_abc123', x: 0, y: 0, width: 3, height: 2 } })
      ),
    })
    .openapi({
      description: 'Bulk update of widget positions and sizes for a given user.',
      example: { widgets: [{ id: 'w_abc123', x: 0, y: 0, width: 3, height: 2 }] },
    });
  registerSwaggerSchema('SaveWidgetsLayout', SaveWidgetsLayoutSchema);

  const endpointsMeta: EndpointMeta[] = [
    {
      name: 'Create Widget',
      desc: 'Create a new widget for the authenticated user (userId taken from token)',
      path: '/',
      method: 'post',
      authorize: true,
      requestBodySchema: CreateWidgetSchema,
      responses: [
        { code: httpStatus.CREATED, desc: 'Widget created', schema: WidgetSchema },
      ],
      functionName: WidgetFunctions.createWidget,
      basePath,
    },
    {
      name: 'Time-off Summary (current month)',
      desc: 'Total approved leave days this month plus breakdown by leave type for the authenticated user',
      path: '/time-off/summary',
      method: 'get',
      authorize: true,
      responses: [
        { code: httpStatus.OK, desc: 'Time-off summary', schema: TimeOffSummarySchema },
      ],
      functionName: WidgetFunctions.timeOffSummary,
      basePath,
    },
    {
      name: 'List My Widgets',
      desc: 'List widgets for the authenticated user (optionally filter by type)',
      path: '/my',
      method: 'get',
      authorize: true,
      responses: [
        { code: httpStatus.OK, desc: 'Widgets list', schema: z.array(WidgetSchema) },
      ],
      functionName: WidgetFunctions.listWidgetsByUser,
      basePath,
    },
    {
      name: 'Save Widgets Layout',
      desc: 'Save layout for all widgets of the authenticated user',
      path: '/layout',
      method: 'post',
      authorize: true,
      requestBodySchema: SaveWidgetsLayoutSchema,
      responses: [
        { code: httpStatus.OK, desc: 'Layout saved' },
      ],
      functionName: WidgetFunctions.saveWidgetsLayout,
      basePath,
    },
    {
      name: 'Get Widget',
      desc: 'Get widget by id',
      path: '/:id',
      method: 'get',
      authorize: true,
      params: [{ name: 'id', in: 'path', type: 'string', required: true }],
      responses: [
        { code: httpStatus.OK, desc: 'Widget', schema: WidgetSchema },
      ],
      functionName: WidgetFunctions.getWidget,
      basePath,
    },
    {
      name: 'Update Widget',
      desc: 'Update widget properties',
      path: '/:id',
      method: 'put',
      authorize: true,
      params: [{ name: 'id', in: 'path', type: 'string', required: true }],
      responses: [
        { code: httpStatus.OK, desc: 'Widget updated' },
      ],
      requestBodySchema: UpdateWidgetSchema,
      functionName: WidgetFunctions.updateWidget,
      basePath,
    },
    {
      name: 'Delete Widget',
      desc: 'Delete widget by id',
      path: '/:id',
      method: 'delete',
      authorize: true,
      params: [{ name: 'id', in: 'path', type: 'string', required: true }],
      responses: [
        { code: httpStatus.OK, desc: 'Widget deleted' },
      ],
      functionName: WidgetFunctions.deleteWidget,
      basePath,
    },
  ];

  const widgetControllerFunctions: Record<WidgetFunctions, RequestHandler> = {
    createWidget: widgetController.createWidget as RequestHandler,
    getWidget: widgetController.getWidget as RequestHandler,
    listWidgetsByUser: widgetController.listWidgetsByUser as RequestHandler,
    updateWidget: widgetController.updateWidget as RequestHandler,
    deleteWidget: widgetController.deleteWidget as RequestHandler,
    saveWidgetsLayout: widgetController.saveWidgetsLayout as RequestHandler,
    timeOffSummary: widgetController.timeOffSummary as RequestHandler,
  };

  const router = Router();
  registerEndpointRoutes(router, endpointsMeta, widgetControllerFunctions);
  return router;
};

export default createWidgetRoute;
import { widgetController } from 'controllers';
import { EndpointMeta } from 'docs/swagger';
import { Router, RequestHandler } from 'express';
import httpStatus from 'http-status';
import registerEndpointRoutes from 'routes/registerEndpointRoutes';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { z } from 'zod';
import {
  BadRequestResponseSchema,
  ContentResponseSchema,
  NotFoundResponseSchema,
  UnauthorizedResponseSchema,
} from 'types/zod/shared.schema';

extendZodWithOpenApi(z);

enum WidgetFunctions {
  createWidget = 'createWidget',
  getWidget = 'getWidget',
  listWidgetsByUser = 'listWidgetsByUser',
  updateWidget = 'updateWidget',
  deleteWidget = 'deleteWidget',
  saveWidgetsLayout = 'saveWidgetsLayout',
}

const createWidgetRoute = (basePath: string): Router => {
  const WidgetSchema = z.object({
    id: z.string().uuid().optional(),
    userId: z.string().uuid(),
    type: z.string(),
    x: z.number().int(),
    y: z.number().int(),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
  }).openapi({
    description: 'Widget layout item on the dashboard grid',
    example: {
      id: '8b1f9c04-f1e5-4f8f-92e2-2c6c17a9f8a1',
      userId: '9f8534ca-6166-4630-89b8-a3024f859c91',
      type: 'calendar',
      x: 0,
      y: 1,
      width: 6,
      height: 4,
      createdAt: '2024-11-10T12:00:00.000Z',
      updatedAt: '2024-11-10T12:30:00.000Z',
    },
  });

  const CreateWidgetSchema = WidgetSchema.omit({ id: true, createdAt: true, updatedAt: true }).openapi({
    description: 'Payload to create a widget for a user dashboard',
    example: {
      userId: '9f8534ca-6166-4630-89b8-a3024f859c91',
      type: 'calendar',
      x: 0,
      y: 0,
      width: 6,
      height: 4,
    },
  });

  const UpdateWidgetSchema = z
    .object({
      x: z.number().int().optional(),
      y: z.number().int().optional(),
      width: z.number().int().positive().optional(),
      height: z.number().int().positive().optional(),
      type: z.string().optional(),
    })
    .openapi({
      description: 'Fields that can be updated on an existing widget',
      example: {
        x: 1,
        y: 2,
        width: 4,
        height: 3,
        type: 'stats',
      },
    });

  const SaveWidgetsLayoutSchema = z
    .object({
      widgets: z.array(
        z.object({
          id: z.string().uuid(),
          x: z.number().int(),
          y: z.number().int(),
          width: z.number().int().positive(),
          height: z.number().int().positive(),
        }),
      ),
    })
    .openapi({
      description: 'New layout positions for the user widgets',
      example: {
        widgets: [
          { id: '8b1f9c04-f1e5-4f8f-92e2-2c6c17a9f8a1', x: 0, y: 0, width: 6, height: 4 },
          { id: '3d7a6c9f-5f2b-4a78-8a8c-2f9c6a9f8b2c', x: 6, y: 0, width: 6, height: 3 },
        ],
      },
    });

  const endpointsMeta: EndpointMeta[] = [
    {
      name: 'Create Widget',
      desc: 'Create a new widget for user dashboard',
      path: '/',
      method: 'post',
      authorize: true,
      requestBodySchema: CreateWidgetSchema,
      responses: [
        { code: httpStatus.CREATED, desc: 'Widget created', schema: ContentResponseSchema(WidgetSchema) },
        { code: httpStatus.BAD_REQUEST, desc: 'Invalid payload', schema: BadRequestResponseSchema },
        { code: httpStatus.UNAUTHORIZED, desc: 'Unauthorized', schema: UnauthorizedResponseSchema },
      ],
      functionName: WidgetFunctions.createWidget,
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
        { code: httpStatus.OK, desc: 'Widget', schema: ContentResponseSchema(WidgetSchema) },
        { code: httpStatus.NOT_FOUND, desc: 'Widget not found', schema: NotFoundResponseSchema },
        { code: httpStatus.UNAUTHORIZED, desc: 'Unauthorized', schema: UnauthorizedResponseSchema },
      ],
      functionName: WidgetFunctions.getWidget,
      basePath,
    },
    {
      name: 'List Widgets By User',
      desc: 'List widgets for a given user (optionally filter by type)',
      path: '/user/:userId',
      method: 'get',
      authorize: true,
      params: [{ name: 'userId', in: 'path', type: 'string', required: true }],
      responses: [
        { code: httpStatus.OK, desc: 'Widgets list', schema: ContentResponseSchema(z.object({ data: z.array(WidgetSchema) })) },
        { code: httpStatus.UNAUTHORIZED, desc: 'Unauthorized', schema: UnauthorizedResponseSchema },
      ],
      functionName: WidgetFunctions.listWidgetsByUser,
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
        { code: httpStatus.OK, desc: 'Widget updated', schema: ContentResponseSchema(WidgetSchema) },
        { code: httpStatus.NOT_FOUND, desc: 'Widget not found', schema: NotFoundResponseSchema },
        { code: httpStatus.UNAUTHORIZED, desc: 'Unauthorized', schema: UnauthorizedResponseSchema },
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
        { code: httpStatus.OK, desc: 'Widget deleted', schema: ContentResponseSchema(z.object({})) },
        { code: httpStatus.NOT_FOUND, desc: 'Widget not found', schema: NotFoundResponseSchema },
        { code: httpStatus.UNAUTHORIZED, desc: 'Unauthorized', schema: UnauthorizedResponseSchema },
      ],
      functionName: WidgetFunctions.deleteWidget,
      basePath,
    },
    {
      name: 'Save Widgets Layout',
      desc: 'Save layout for all widgets of a user',
      path: '/user/:userId/layout',
      method: 'post',
      authorize: true,
      params: [{ name: 'userId', in: 'path', type: 'string', required: true }],
      requestBodySchema: SaveWidgetsLayoutSchema,
      responses: [
        { code: httpStatus.OK, desc: 'Layout saved', schema: ContentResponseSchema(z.object({ data: z.array(WidgetSchema) })) },
        { code: httpStatus.BAD_REQUEST, desc: 'Invalid payload', schema: BadRequestResponseSchema },
        { code: httpStatus.UNAUTHORIZED, desc: 'Unauthorized', schema: UnauthorizedResponseSchema },
      ],
      functionName: WidgetFunctions.saveWidgetsLayout,
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
  };

  const router = Router();
  registerEndpointRoutes(router, endpointsMeta, widgetControllerFunctions);
  return router;
};

export default createWidgetRoute;

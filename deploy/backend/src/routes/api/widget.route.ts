import { widgetController } from 'controllers';
import { EndpointMeta } from 'docs/swagger';
import { Router, RequestHandler } from 'express';
import httpStatus from 'http-status';
import registerEndpointRoutes from 'routes/registerEndpointRoutes';
import { z } from 'zod';

enum WidgetFunctions {
  createWidget = 'createWidget',
  getWidget = 'getWidget',
  listWidgetsByUser = 'listWidgetsByUser',
  updateWidget = 'updateWidget',
  deleteWidget = 'deleteWidget',
  saveWidgetsLayout = 'saveWidgetsLayout',
}

const createWidgetRoute = (basePath: string): Router => {
  const CreateWidgetSchema = z.object({
    x: z.number().int(),
    y: z.number().int(),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    userId: z.string(),
    type: z.string(),
  });

  const UpdateWidgetSchema = z.object({
    x: z.number().int().optional(),
    y: z.number().int().optional(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    type: z.string().optional(),
  });

  const SaveWidgetsLayoutSchema = z.object({
    widgets: z.array(
      z.object({
        id: z.string(),
        x: z.number().int(),
        y: z.number().int(),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
      })
    ),
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
        { code: httpStatus.CREATED, desc: 'Widget created' },
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
        { code: httpStatus.OK, desc: 'Widget' },
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
        { code: httpStatus.OK, desc: 'Widgets list' },
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
    {
      name: 'Save Widgets Layout',
      desc: 'Save layout for all widgets of a user',
      path: '/user/:userId/layout',
      method: 'post',
      authorize: true,
      params: [{ name: 'userId', in: 'path', type: 'string', required: true }],
      requestBodySchema: SaveWidgetsLayoutSchema,
      responses: [
        { code: httpStatus.OK, desc: 'Layout saved' },
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

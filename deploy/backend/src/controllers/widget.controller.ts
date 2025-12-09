import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { widgetService } from 'services';
import catchAsync from 'shared/utils/CatchAsync';
import ApiError from 'shared/error/ApiError';

export const createWidget = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const created = await widgetService.createWidget(payload);

  res.status(httpStatus.CREATED).send({
    success: true,
    message: 'Widget created successfully',
    content: created,
  });
});

export const getWidget = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const widget = await widgetService.getWidgetById(id);

  res.status(httpStatus.OK).send({
    success: true,
    content: widget,
  });
});

export const listWidgetsByUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const type = (req.query.type as string) || undefined;
  const widgets = await widgetService.getWidgetsByUserIdAndType(userId, type);

  res.status(httpStatus.OK).send({
    success: true,
    content: { data: widgets },
  });
});

export const updateWidget = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const updated = await widgetService.updateWidget(id, updates);

  res.status(httpStatus.OK).send({
    success: true,
    message: 'Widget updated successfully',
    content: updated,
  });
});

export const deleteWidget = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await widgetService.deleteWidget(id);

  res.status(httpStatus.OK).send({
    success: true,
    message: 'Widget deleted successfully',
  });
});

export const saveWidgetsLayout = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { widgets } = req.body;

  if (!widgets || !Array.isArray(widgets) || widgets.length === 0) {
    throw new ApiError('widgets array is required', httpStatus.BAD_REQUEST);
  }

  const updated = await widgetService.saveWidgetsLayout(userId, widgets);
  res.status(httpStatus.OK).send({
    success: true,
    message: 'Widgets layout saved',
    content: { data: updated },
  });
});

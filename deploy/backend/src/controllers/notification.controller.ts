import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { notificationService } from 'services';
import catchAsync from 'shared/utils/CatchAsync';
import assertAuthenticatedUser from 'shared/utils/assertAuth';

export const getUnreadNotifications = catchAsync(async (req: Request, res: Response) => {
  assertAuthenticatedUser(req);
  const notifications = await notificationService.getUnreadNotifications(req.user.id);

  res.status(httpStatus.OK).send({
    success: true,
    content: notifications,
  });
});

export const markAsRead = catchAsync(async (req: Request, res: Response) => {
  assertAuthenticatedUser(req);
  const { notificationId } = req.params;
  const notification = await notificationService.markNotificationAsRead(notificationId);

  res.status(httpStatus.OK).send({
    success: true,
    content: notification,
  });
});

export const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
  assertAuthenticatedUser(req);
  const result = await notificationService.markAllNotificationsAsRead(req.user.id);

  res.status(httpStatus.OK).send({
    success: true,
    content: result,
  });
});

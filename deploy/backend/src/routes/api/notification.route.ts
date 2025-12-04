import { notificationController } from 'controllers';
import { EndpointMeta } from 'docs/swagger';
import { Router, RequestHandler } from 'express';
import httpStatus from 'http-status';

import registerEndpointRoutes from 'routes/registerEndpointRoutes';
import { 
  UnreadNotificationsSuccessSchema, 
  MarkAsReadSuccessSchema,
  MarkAllAsReadSuccessSchema 
} from 'types/zod/notification.schema';
import {
  UnauthorizedResponseSchema,
  BadRequestResponseSchema,
} from 'types/zod/shared.schema';

enum NotificationFunctions {
  getUnreadNotifications = 'getUnreadNotifications',
  markAsRead = 'markAsRead',
  markAllAsRead = 'markAllAsRead',
}

const createNotificationRoute = (basePath: string): Router => {
  const endpointsMeta: EndpointMeta[] = [
    {
      name: 'Get Unread Notifications',
      desc: 'Get all unread leave request notifications for the authenticated user',
      path: '/',
      method: 'get',
      authorize: true,
      responses: [
        {
          code: httpStatus.OK,
          desc: 'Unread notifications retrieved successfully',
          schema: UnreadNotificationsSuccessSchema,
        },
        {
          code: httpStatus.UNAUTHORIZED,
          desc: 'User not authenticated',
          schema: UnauthorizedResponseSchema,
        },
      ],
      functionName: NotificationFunctions.getUnreadNotifications,
      basePath,
    },
    {
      name: 'Mark Notification as Read',
      desc: 'Mark a specific notification as read',
      path: '/:notificationId/read',
      method: 'patch',
      authorize: true,
      responses: [
        {
          code: httpStatus.OK,
          desc: 'Notification marked as read',
          schema: MarkAsReadSuccessSchema,
        },
        {
          code: httpStatus.UNAUTHORIZED,
          desc: 'User not authenticated',
          schema: UnauthorizedResponseSchema,
        },
        {
          code: httpStatus.BAD_REQUEST,
          desc: 'Invalid notification ID',
          schema: BadRequestResponseSchema,
        },
      ],
      functionName: NotificationFunctions.markAsRead,
      basePath,
    },
    {
      name: 'Mark All Notifications as Read',
      desc: 'Mark all notifications as read for the authenticated user',
      path: '/read-all',
      method: 'patch',
      authorize: true,
      responses: [
        {
          code: httpStatus.OK,
          desc: 'All notifications marked as read',
          schema: MarkAllAsReadSuccessSchema,
        },
        {
          code: httpStatus.UNAUTHORIZED,
          desc: 'User not authenticated',
          schema: UnauthorizedResponseSchema,
        },
      ],
      functionName: NotificationFunctions.markAllAsRead,
      basePath,
    },
  ];

  const notificationControllerFunctions: Record<NotificationFunctions, RequestHandler> = {
    getUnreadNotifications: notificationController.getUnreadNotifications,
    markAsRead: notificationController.markAsRead,
    markAllAsRead: notificationController.markAllAsRead,
  };

  const router = Router();
  registerEndpointRoutes(router, endpointsMeta, notificationControllerFunctions);
  return router;
};

export default createNotificationRoute;

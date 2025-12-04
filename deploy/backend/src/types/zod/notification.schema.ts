import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

// Notification schema
export const NotificationSchema = z
  .object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    leaveRequestId: z.string().uuid(),
    title: z.string(),
    isRead: z.boolean(),
    createdAt: z.string().datetime(),
  })
  .openapi({
    description: 'Leave request notification',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      userId: '123e4567-e89b-12d3-a456-426614174001',
      leaveRequestId: '123e4567-e89b-12d3-a456-426614174002',
      title: 'Your leave request was approved',
      isRead: false,
      createdAt: '2024-12-04T10:30:00Z',
    },
  });

// Unread notifications list response
export const UnreadNotificationsSuccessSchema = z
  .object({
    success: z.boolean(),
    content: z.array(NotificationSchema),
  })
  .openapi({
    description: 'List of unread notifications for the authenticated user',
    example: {
      success: true,
      content: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          userId: '123e4567-e89b-12d3-a456-426614174001',
          leaveRequestId: '123e4567-e89b-12d3-a456-426614174002',
          title: 'Your leave request was approved',
          isRead: false,
          createdAt: '2024-12-04T10:30:00Z',
        },
      ],
    },
  });

// Mark as read response
export const MarkAsReadSuccessSchema = z
  .object({
    success: z.boolean(),
    content: NotificationSchema,
  })
  .openapi({
    description: 'Successfully marked notification as read',
    example: {
      success: true,
      content: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        leaveRequestId: '123e4567-e89b-12d3-a456-426614174002',
        title: 'Your leave request was approved',
        isRead: true,
        createdAt: '2024-12-04T10:30:00Z',
      },
    },
  });

// Mark all as read response
export const MarkAllAsReadSuccessSchema = z
  .object({
    success: z.boolean(),
    content: z.object({
      count: z.number(),
    }),
  })
  .openapi({
    description: 'Successfully marked all notifications as read',
    example: {
      success: true,
      content: {
        count: 3,
      },
    },
  });

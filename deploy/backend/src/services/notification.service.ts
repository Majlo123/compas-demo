import { leaveRequestNotificationRepository } from 'repos/index';
import type { CreateLeaveRequestNotification } from 'repos/notification.model';
import logger from 'config/logger';
import { emitToUser } from 'config/socket';

/**
 * Create a new notification and emit socket event
 */
export const createNotification = async (
  notificationData: CreateLeaveRequestNotification,
): Promise<any> => {
  try {
    const notification = await leaveRequestNotificationRepository.create(notificationData);
    
    // Emit socket event to the user
    emitToUser(notificationData.userId, 'notification:new', notification);
    
    logger.info(`Created notification for user ${notificationData.userId}`);
    return notification;
  } catch (error) {
    logger.error(`Failed to create notification: ${String(error)}`);
    throw error;
  }
};

/**
 * Get unread notifications for a user
 */
export const getUnreadNotifications = async (userId: string) => {
  try {
    const notifications = await leaveRequestNotificationRepository.findUnreadByUserId(userId);
    return notifications;
  } catch (error) {
    logger.error(`Failed to fetch notifications for user ${userId}: ${String(error)}`);
    throw error;
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const notification = await leaveRequestNotificationRepository.markAsRead(notificationId);
    return notification;
  } catch (error) {
    logger.error(`Failed to mark notification ${notificationId} as read: ${String(error)}`);
    throw error;
  }
};

/**
 * Mark all notifications as read for a user
 */
export const markAllNotificationsAsRead = async (userId: string) => {
  try {
    const count = await leaveRequestNotificationRepository.markAllAsReadForUser(userId);
    return { count };
  } catch (error) {
    logger.error(`Failed to mark all notifications as read for user ${userId}: ${String(error)}`);
    throw error;
  }
};

/**
 * Update notification titles for a specific leave request and emit socket events
 */
export const updateNotificationsForLeaveRequest = async (
  leaveRequestId: string,
  newTitle: string
) => {
  try {
    // Update the notification titles
    await leaveRequestNotificationRepository.updateTitleByLeaveRequestId(leaveRequestId, newTitle);
    
    // Get all updated notifications to emit socket events
    const notifications = await leaveRequestNotificationRepository.findByLeaveRequestId(leaveRequestId);
    
    // Emit socket events to all affected users
    notifications.forEach((notification) => {
      emitToUser(notification.userId, 'notification:updated', notification);
    });
    
    logger.info(`Updated ${notifications.length} notification(s) for leave request ${leaveRequestId}`);
    return notifications;
  } catch (error) {
    logger.error(`Failed to update notifications for leave request ${leaveRequestId}: ${String(error)}`);
    throw error;
  }
};

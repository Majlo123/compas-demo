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
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error(err);
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
    const err = error instanceof Error ? error : new Error(`Failed to fetch notifications for user ${userId}`);
    logger.error(err);
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
    const err = error instanceof Error ? error : new Error(`Failed to mark notification ${notificationId} as read`);
    logger.error(err);
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
    const err = error instanceof Error ? error : new Error(`Failed to mark all notifications as read for user ${userId}`);
    logger.error(err);
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
    const err = error instanceof Error ? error : new Error(`Failed to update notifications for leave request ${leaveRequestId}`);
    logger.error(err);
    throw error;
  }
};

/**
 * Delete all notifications for a specific leave request and emit socket events
 */
export const deleteNotificationsForLeaveRequest = async (
  leaveRequestId: string
) => {
  try {
    // Get all notifications before deleting to emit socket events
    const notifications = await leaveRequestNotificationRepository.findByLeaveRequestId(leaveRequestId);
    
    // Delete the notifications
    const deletedCount = await leaveRequestNotificationRepository.deleteByLeaveRequestId(leaveRequestId);
    
    // Emit socket events to all affected users
    notifications.forEach((notification) => {
      emitToUser(notification.userId, 'notification:deleted', { id: notification.id });
    });
    
    logger.info(`Deleted ${deletedCount} notification(s) for leave request ${leaveRequestId}`);
    return deletedCount;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(`Failed to delete notifications for leave request ${leaveRequestId}`);
    logger.error(err);
    throw error;
  }
};

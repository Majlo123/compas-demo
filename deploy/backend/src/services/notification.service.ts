import { leaveRequestNotificationRepository } from 'repos/index';
import logger from 'config/logger';

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

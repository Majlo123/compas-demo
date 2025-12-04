import createBaseRepository from 'repos/utils/baseRepository';
import pool from 'config/database';

export type LeaveRequestNotification = {
  id?: string;
  userId: string;
  leaveRequestId: string;
  title: string;
  isRead?: boolean;
  createdAt?: Date;
};

export type CreateLeaveRequestNotification = Omit<LeaveRequestNotification, 'id' | 'createdAt'>;

const { create, findById, findByField, findAll, updateById, deleteById } =
  createBaseRepository<LeaveRequestNotification>('leave_request_notifications');

/**
 * Find all notifications for a specific user
 */
export const findByUserId = async (userId: string): Promise<LeaveRequestNotification[]> => {
  const query = {
    text: 'SELECT * FROM leave_request_notifications WHERE user_id = $1 ORDER BY created_at DESC',
    values: [userId],
  };

  const result = await pool.query(query);
  return result.rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    leaveRequestId: row.leave_request_id,
    title: row.title,
    isRead: row.is_read,
    createdAt: row.created_at,
  }));
};

/**
 * Find unread notifications for a specific user
 */
export const findUnreadByUserId = async (userId: string): Promise<LeaveRequestNotification[]> => {
  const query = {
    text: 'SELECT * FROM leave_request_notifications WHERE user_id = $1 AND is_read = FALSE ORDER BY created_at DESC',
    values: [userId],
  };

  const result = await pool.query(query);
  return result.rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    leaveRequestId: row.leave_request_id,
    title: row.title,
    isRead: row.is_read,
    createdAt: row.created_at,
  }));
};

/**
 * Mark notification as read
 */
export const markAsRead = async (id: string): Promise<LeaveRequestNotification | null> => {
  const query = {
    text: 'UPDATE leave_request_notifications SET is_read = TRUE WHERE id = $1 RETURNING *',
    values: [id],
  };

  const result = await pool.query(query);
  
  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    id: row.id,
    userId: row.user_id,
    leaveRequestId: row.leave_request_id,
    title: row.title,
    isRead: row.is_read,
    createdAt: row.created_at,
  };
};

/**
 * Mark all notifications as read for a user
 */
export const markAllAsReadForUser = async (userId: string): Promise<number> => {
  const query = {
    text: 'UPDATE leave_request_notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE',
    values: [userId],
  };

  const result = await pool.query(query);
  return result.rowCount || 0;
};

export { create, findById, findByField, findAll, updateById, deleteById };

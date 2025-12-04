import createBaseRepository from 'repos/utils/baseRepository';
import pool from 'config/database';

export type Notification = {
  id?: string;
  userId: string;
  title: string;
  isRead?: boolean;
  createdAt?: Date;
};

export type CreateNotification = Omit<Notification, 'id' | 'createdAt'>;

const { create, findById, findByField, findAll, updateById, deleteById } =
  createBaseRepository<Notification>('notifications');

/**
 * Find all notifications for a specific user
 */
export const findByUserId = async (userId: string): Promise<Notification[]> => {
  const query = {
    text: 'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
    values: [userId],
  };

  const result = await pool.query(query);
  return result.rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    title: row.title,
    isRead: row.is_read,
    createdAt: row.created_at,
  }));
};

/**
 * Find unread notifications for a specific user
 */
export const findUnreadByUserId = async (userId: string): Promise<Notification[]> => {
  const query = {
    text: 'SELECT * FROM notifications WHERE user_id = $1 AND is_read = FALSE ORDER BY created_at DESC',
    values: [userId],
  };

  const result = await pool.query(query);
  return result.rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    title: row.title,
    isRead: row.is_read,
    createdAt: row.created_at,
  }));
};

/**
 * Mark notification as read
 */
export const markAsRead = async (id: string): Promise<Notification | null> => {
  const query = {
    text: 'UPDATE notifications SET is_read = TRUE WHERE id = $1 RETURNING *',
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
    text: 'UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE',
    values: [userId],
  };

  const result = await pool.query(query);
  return result.rowCount || 0;
};

export { create, findById, findByField, findAll, updateById, deleteById };

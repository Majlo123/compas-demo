import createBaseRepository from 'repos/utils/baseRepository';
import pool from 'config/database';

export type UserInvite = {
  id?: string;
  email: string;
  token: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  expiresAt: Date;
  createdAt?: Date;
  usedAt?: Date;
};

export type CreateUserInvite = Omit<UserInvite, 'id' | 'createdAt' | 'usedAt' | 'status'>;

const { create, findById, findByField, findAll, updateById, deleteById } =
  createBaseRepository<UserInvite>('user_invites');

/**
 * Find invite by token
 */
export const findByToken = async (token: string): Promise<UserInvite | null> => {
  const result = await pool.query(
    'SELECT * FROM user_invites WHERE token = $1',
    [token]
  );
  
  if (result.rows.length === 0) return null;
  
  const row = result.rows[0];
  return {
    id: row.id,
    email: row.email,
    token: row.token,
    status: row.status,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    usedAt: row.used_at,
  };
};

/**
 * Find pending invite by email
 */
export const findPendingByEmail = async (email: string): Promise<UserInvite | null> => {
  const result = await pool.query(
    `SELECT * FROM user_invites 
     WHERE email = $1 AND status = 'pending'
     ORDER BY created_at DESC
     LIMIT 1`,
    [email]
  );
  
  if (result.rows.length === 0) return null;
  
  const row = result.rows[0];
  return {
    id: row.id,
    email: row.email,
    token: row.token,
    status: row.status,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    usedAt: row.used_at,
  };
};

/**
 * Update invite status
 */
export const updateStatus = async (
  id: string,
  status: 'accepted' | 'expired' | 'revoked',
  usedAt?: Date
): Promise<UserInvite | null> => {
  const result = await pool.query(
    `UPDATE user_invites
     SET status = $1, used_at = $2
     WHERE id = $3
     RETURNING *`,
    [status, usedAt || null, id]
  );
  
  if (result.rows.length === 0) return null;
  
  const row = result.rows[0];
  return {
    id: row.id,
    email: row.email,
    token: row.token,
    status: row.status,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    usedAt: row.used_at,
  };
};

/**
 * Mark expired invites
 */
export const markExpiredInvites = async (): Promise<number> => {
  const result = await pool.query(
    `UPDATE user_invites
     SET status = 'expired'
     WHERE status = 'pending' AND expires_at < NOW()
     RETURNING id`
  );
  return result.rowCount || 0;
};

export { create, findById, findByField, findAll, updateById, deleteById };

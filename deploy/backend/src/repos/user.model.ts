import createBaseRepository from 'repos/utils/baseRepository';
import { Role } from '../../../shared/auth.types';
import pool from 'config/database';

export type User = {
  id?: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: Role;
  isActivated?: boolean;
  emailNotificationsEnabled?: boolean;
  profileImageBlob?: Buffer;
  vacationDaysInit?: number;
  vacationDaysLeft?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

const { create, findById, findByField, findAll, updateById, deleteById } =
  createBaseRepository<User>('users');

export const findAllActiveWithBalances = async (): Promise<Array<Pick<User, 'id' | 'fullName' | 'email' | 'vacationDaysInit' | 'vacationDaysLeft'>>> => {
  const query = `
    SELECT 
      id,
      full_name as "fullName",
      email,
      COALESCE(vacation_days_init, 0) as "vacationDaysInit",
      COALESCE(vacation_days_left, 0) as "vacationDaysLeft"
    FROM users
    WHERE is_activated = TRUE
  `;

  const result = await pool.query(query);
  return result.rows.map((row) => ({
    id: row.id,
    fullName: row.fullname || row.fullName || row.full_name,
    email: row.email,
    vacationDaysInit: Number(row.vacationDaysInit),
    vacationDaysLeft: Number(row.vacationDaysLeft),
  }));
};

/**
 * Search users by name or email
 */
export const searchByNameOrEmail = async (searchQuery: string): Promise<any[]> => {
  if (!searchQuery || searchQuery.trim() === '') {
    return [];
  }

  const query = `
    SELECT id, full_name as "fullName", email, vacation_days_init as "vacationDaysInit", vacation_days_left as "vacationDaysLeft", profile_image_blob as "profileImageBlob"
    FROM users
    WHERE is_activated = TRUE
      AND (LOWER(full_name) LIKE LOWER($1) OR LOWER(email) LIKE LOWER($1))
    LIMIT 5
  `;

  const searchPattern = `%${searchQuery}%`;
  const result = await pool.query(query, [searchPattern]);

  return result.rows;
};

export const findAllActivePaginated = async (page: number, pageSize: number, excludeUserId?: string): Promise<{ data: any[]; totalItems: number; totalPages: number; page: number; pageSize: number; }> => {
  const offset = (page - 1) * pageSize;
  const excludeClause = excludeUserId ? 'AND id != $1' : '';
  const countQuery = `SELECT COUNT(*) FROM users WHERE is_activated = TRUE ${excludeClause}`;
  const dataQuery = `
    SELECT id, full_name as "fullName", email, vacation_days_init as "vacationDaysInit", vacation_days_left as "vacationDaysLeft", profile_image_blob as "profileImageBlob"
    FROM users
    WHERE is_activated = TRUE ${excludeClause}
    ORDER BY created_at DESC
    ${excludeUserId ? 'LIMIT $2 OFFSET $3' : 'LIMIT $1 OFFSET $2'}`;

  const countParams = excludeUserId ? [excludeUserId] : [];
  const dataParams = excludeUserId ? [excludeUserId, pageSize, offset] : [pageSize, offset];

  const [countResult, dataResult] = await Promise.all([
    pool.query(countQuery, countParams),
    pool.query(dataQuery, dataParams),
  ]);

  const totalItems = parseInt(countResult.rows[0].count, 10);
  return {
    data: dataResult.rows,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
    page,
    pageSize,
  };
};

export const deactivateUser = async (userId: string): Promise<boolean> => {
  const updated = await updateById(userId, { isActivated: false });
  return !!updated;
};

/**
 * Find user by email
 */
export const findByEmail = async (email: string): Promise<User | null> => {
  const query = {
    text: 'SELECT * FROM users WHERE email = $1 LIMIT 1',
    values: [email],
  };

  const result = await pool.query(query);

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    isActivated: row.is_activated,
    emailNotificationsEnabled: row.email_notifications_enabled,
    vacationDaysInit: row.vacation_days_init ?? 0,
    vacationDaysLeft: row.vacation_days_left ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

// ... existing exports
export const addVacationDaysToAllActiveUsers = async (days: number): Promise<number> => {
  const query = `
    UPDATE users
    SET vacation_days_left = COALESCE(vacation_days_left, 0) + $1,
        vacation_days_init = COALESCE(vacation_days_left, 0) + $1
    WHERE is_activated = TRUE
  `;
  const result = await pool.query(query, [days]);
  return result.rowCount || 0;
};

export const deductVacationDays = async (userId: string, days: number): Promise<boolean> => {
  const query = `
    UPDATE users
    SET vacation_days_left = GREATEST(COALESCE(vacation_days_left, 0) - $1, 0)
    WHERE id = $2
  `;
  const result = await pool.query(query, [days, userId]);
  return (result.rowCount || 0) > 0;
};

export { create, findById, findByField, findAll, updateById, deleteById };

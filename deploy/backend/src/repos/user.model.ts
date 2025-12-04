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
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

const { create, findById, findByField, findAll, updateById, deleteById } =
  createBaseRepository<User>('users');

/**
 * Search users by name or email
 */
export const searchByNameOrEmail = async (searchQuery: string): Promise<any[]> => {
  if (!searchQuery || searchQuery.trim() === '') {
    return [];
  }

  const query = `
    SELECT id, full_name as "fullName", email
    FROM users
    WHERE is_activated = TRUE
      AND (LOWER(full_name) LIKE LOWER($1) OR LOWER(email) LIKE LOWER($1))
    LIMIT 5
  `;
  
  const searchPattern = `%${searchQuery}%`;
  const result = await pool.query(query, [searchPattern]);
  
  return result.rows;
};

export const findAllActivePaginated = async (page: number, pageSize: number): Promise<{ data: any[]; totalItems: number; totalPages: number; page: number; pageSize: number; }> => {
  const offset = (page - 1) * pageSize;
  const countQuery = 'SELECT COUNT(*) FROM users WHERE is_activated = TRUE';
  const dataQuery = `
    SELECT id, full_name as "fullName", email
    FROM users
    WHERE is_activated = TRUE
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2`;

  const [countResult, dataResult] = await Promise.all([
    pool.query(countQuery),
    pool.query(dataQuery, [pageSize, offset]),
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
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

export { create, findById, findByField, findAll, updateById, deleteById };

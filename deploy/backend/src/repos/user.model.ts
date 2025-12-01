import createBaseRepository from 'repos/utils/baseRepository';
import { Role } from '../../../shared/auth.types';
import pool from 'config/database';

export type User = {
  id?: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: Role;
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
    WHERE LOWER(full_name) LIKE LOWER($1)
       OR LOWER(email) LIKE LOWER($1)
    LIMIT 5
  `;
  
  const searchPattern = `%${searchQuery}%`;
  const result = await pool.query(query, [searchPattern]);
  
  return result.rows;
};

export { create, findById, findByField, findAll, updateById, deleteById };

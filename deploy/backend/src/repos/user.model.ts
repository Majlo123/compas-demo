import createBaseRepository from 'repos/utils/baseRepository';
import { Role } from '../../../shared/auth.types';

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

export { create, findById, findByField, findAll, updateById, deleteById };

import createBaseRepository from 'repos/utils/baseRepository';

export type User = {
  id?: string;
  fullName: string;
  email: string;
  passwordHash: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

const { create, findById, findByField, findAll, updateById, deleteById } =
  createBaseRepository<User>('users');

export { create, findById, findByField, findAll, updateById, deleteById };

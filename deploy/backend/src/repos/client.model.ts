import { Client } from '@shared/client.types';
import createBaseRepository from 'repos/utils/baseRepository';

export type CreateClient = Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'projectCount'>;

const { create, findById, findByField, findAll, updateById, deleteById } =
  createBaseRepository<Client>('clients');

export { create, findById, findByField, findAll, updateById, deleteById };

import createBaseRepository from 'repos/utils/baseRepository';

export type Client = {
  id?: string;
  name: string;
  hourlyRate: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateClient = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;

const { create, findById, findByField, findAll, updateById, deleteById } =
  createBaseRepository<Client>('clients');

export { create, findById, findByField, findAll, updateById, deleteById };

import createBaseRepository from 'repos/utils/baseRepository';

export type Organization = {
  id?: string;
  name: string;
  domain?: string;
  address?: string;
  email: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateOrganization = Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>;

const { create, findById, findByField, findAll, updateById, deleteById } =
  createBaseRepository<Organization>();

export { create, findById, findByField, findAll, updateById, deleteById };

import createBaseRepository from 'repos/utils/baseRepository';

export type Team = {
  id?: string;
  name: string;
  description?: string;
  memberCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateTeam = Omit<Team, 'id' | 'createdAt' | 'updatedAt'>;

const { create, findById, findByField, findAll, updateById, deleteById } =
  createBaseRepository<Team>('teams');

export { create, findById, findByField, findAll, updateById, deleteById };

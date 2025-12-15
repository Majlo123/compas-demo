import createBaseRepository from 'repos/utils/baseRepository';


export type TimeEntry = {
  id?: string;
  projectName: string;
  description?: string;
  timeSpent: number;
  isOvertime?: boolean;
  createdAt?: Date;
};

export type CreateTimeEntry = Omit<TimeEntry, 'id' | 'createdAt' >;

const { create, findById, findByField, findAll, updateById, deleteById } =
  createBaseRepository<TimeEntry>('time_entries');

export { create, findById, findByField, findAll, updateById, deleteById };
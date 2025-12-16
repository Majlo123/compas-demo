import createBaseRepository from 'repos/utils/baseRepository';


export type TimeEntry = {
  id?: string;
  userId: string;
  projectName: string;
  description?: string;
  startate: Date;
  timeSpentMinutes: number;
  isOvertime?: boolean;
  createdAt?: Date;
};

export type CreateTimeEntry = Omit<TimeEntry, 'id' | 'userId' | 'startDate' | 'createdAt' >;

const { create, findById, findByField, findAll, updateById, deleteById } =
  createBaseRepository<TimeEntry>('time_entries');

export { create, findById, findByField, findAll, updateById, deleteById };

export function findAllByUserId(userId: string, arg1: { queryParams: QueryParams; }) {
    throw new Error('Function not implemented.');
}

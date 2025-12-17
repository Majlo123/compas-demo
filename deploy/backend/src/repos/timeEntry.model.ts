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

export const findByUserId = async (userId: string): Promise<TimeEntry[]> => {
    try {
        const pool = require('config/database').default;
        const result = await pool.query(
            'SELECT * FROM time_entries WHERE user_id = $1 ORDER BY start_date DESC',
            [userId]
        );
        return result.rows;
    } catch (error) {
        console.error('Error finding time entries by userId:', error);
        return [];
    }
};

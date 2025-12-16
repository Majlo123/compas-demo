import createBaseRepository from 'repos/utils/baseRepository';


export type TimeEntry = {
  id?: string;
  userId: string;
  projectName: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  isOvertime?: boolean;
  isBillable?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateTimeEntry = Omit<TimeEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

const { create, findById, findByField, findAll, updateById, deleteById } =
  createBaseRepository<TimeEntry>('time_entries');

export { create, findById, findByField, findAll, updateById, deleteById };

export const findByUserId = async (userId: string): Promise<TimeEntry[]> => {
  try {
    const pool = require('config/database').default;
    const result = await pool.query(
      'SELECT * FROM time_entries WHERE user_id = $1 ORDER BY start_time DESC',
      [userId]
    );

    return result.rows.map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      projectName: row.project_name,
      description: row.description,
      startTime: row.start_time,
      endTime: row.end_time,
      isOvertime: row.is_overtime,
      isBillable: row.is_billable,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  } catch (error) {
    console.error('Error finding time entries by userId:', error);
    return [];
  }
};

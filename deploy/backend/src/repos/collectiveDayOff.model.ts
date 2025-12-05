import createBaseRepository from 'repos/utils/baseRepository';
import pool from 'config/database';

export type CollectiveDayOff = {
  id?: string;
  startDate: Date;
  endDate: Date;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateCollectiveDayOff = Omit<CollectiveDayOff, 'id' | 'createdAt' | 'updatedAt'>;

const { create, findById, findByField, findAll, updateById, deleteById } =
  createBaseRepository<CollectiveDayOff>('collective_days_off');

/**
 * Find all collective days off
 */
export const findAllCollectiveDaysOff = async (): Promise<CollectiveDayOff[]> => {
  const query = {
    text: 'SELECT * FROM collective_days_off ORDER BY start_date ASC',
  };

  const result = await pool.query(query);
  return result.rows.map((row) => ({
    id: row.id,
    startDate: row.start_date,
    endDate: row.end_date,
    description: row.description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
};

/**
 * Find collective days off within a date range
 */
export const findByDateRange = async (startDate: Date, endDate: Date): Promise<CollectiveDayOff[]> => {
  const query = {
    text: `SELECT * FROM collective_days_off 
           WHERE start_date <= $2 AND end_date >= $1 
           ORDER BY start_date ASC`,
    values: [startDate, endDate],
  };

  const result = await pool.query(query);
  return result.rows.map((row) => ({
    id: row.id,
    startDate: row.start_date,
    endDate: row.end_date,
    description: row.description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
};

/**
 * Check if dates overlap with existing collective days off
 */
export const checkDateOverlap = async (startDate: Date, endDate: Date, excludeId?: string): Promise<boolean> => {
  const query = {
    text: `SELECT COUNT(*) as count FROM collective_days_off 
           WHERE start_date <= $2 AND end_date >= $1
           ${excludeId ? 'AND id != $3' : ''}`,
    values: excludeId ? [startDate, endDate, excludeId] : [startDate, endDate],
  };

  const result = await pool.query(query);
  return parseInt(result.rows[0].count, 10) > 0;
};

/**
 * Create a new collective day off
 */
export const createCollectiveDayOff = async (data: CreateCollectiveDayOff): Promise<CollectiveDayOff> => {
  const query = {
    text: `INSERT INTO collective_days_off (start_date, end_date, description) 
           VALUES ($1, $2, $3) 
           RETURNING *`,
    values: [data.startDate, data.endDate, data.description],
  };

  const result = await pool.query(query);
  const row = result.rows[0];
  return {
    id: row.id,
    startDate: row.start_date,
    endDate: row.end_date,
    description: row.description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

export { create, findById, findByField, findAll, updateById, deleteById };

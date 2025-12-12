import createBaseRepository from 'repos/utils/baseRepository';
import pool from 'config/database';
import { WidgetType } from '../../../shared/enums';



export type Widget = {
	id?: string;
	x: number;
	y: number;
	width: number;
	height: number;
  userId: string;
  type: WidgetType;
	createdAt?: Date;
	updatedAt?: Date;
};

export type CreateWidget = Omit<Widget, 'id' | 'userId'| 'createdAt' | 'updatedAt'>;


const { create, findById, findByField, findAll, updateById, deleteById } =
	createBaseRepository<Widget>('widgets');


export { create, findById, findByField, findAll, updateById, deleteById };

export const findByUserId = async (UserId: string): Promise<Widget[]> => {
  const query = {
    text: 'SELECT * FROM widgets WHERE user_id = $1',
    values: [UserId],
  };
  const result = await pool.query(query);
  return result.rows.map(row => ({
    id: row.id,
    userId: row.user_id,
    x: row.x,
    y: row.y,
    width: row.width,
    height: row.height,
    type: row.type,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
};

export const findByType = async (type: string): Promise<Widget[]> => {
  const query = {
    text: 'SELECT * FROM widgets WHERE type = $1',
    values: [type],
  };
  const result = await pool.query(query);
  return result.rows.map(row => ({
    id: row.id,
    userId: row.user_id,
    x: row.x,
    y: row.y,
    width: row.width,
    height: row.height,
    type: row.type,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
};

export const findByUserIdAndType = async (userId: string, type?: string): Promise<Widget[]> => {
  if (!type) {
    return findByUserId(userId);
  }

  const query = {
    text: 'SELECT * FROM widgets WHERE user_id = $1 AND type = $2',
    values: [userId, type],
  };

  const result = await pool.query(query);
  return result.rows.map(row => ({
    id: row.id,
    userId: row.user_id,
    x: row.x,
    y: row.y,
    width: row.width,
    height: row.height,
    type: row.type,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
};
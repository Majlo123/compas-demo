import knex from 'knex';
import knexConfig from '../../knexfile';

const db = knex(knexConfig.development);

export type WarningLevel = {
  id?: string;
  name: string;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateWarningLevel = Omit<WarningLevel, 'id' | 'createdAt' | 'updatedAt'>;

export const create = async (data: CreateWarningLevel): Promise<WarningLevel> => {
  const [result] = await db('warning_level')
    .insert({
      name: data.name,
      description: data.description || null,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning('*');

  return mapToWarningLevel(result);
};

export const findById = async (id: string): Promise<WarningLevel | null> => {
  const result = await db('warning_level')
    .where({ id })
    .first();

  return result ? mapToWarningLevel(result) : null;
};

export const findAll = async (): Promise<WarningLevel[]> => {
  const results = await db('warning_level')
    .orderBy('name', 'asc')
    .select('*');

  return results.map(mapToWarningLevel);
};

export const findByName = async (name: string): Promise<WarningLevel | null> => {
  const result = await db('warning_level')
    .where({ name })
    .first();

  return result ? mapToWarningLevel(result) : null;
};

export const updateById = async (id: string, data: Partial<CreateWarningLevel>): Promise<WarningLevel | null> => {
  const updateData: any = {
    updated_at: new Date(),
  };

  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description || null;

  const [result] = await db('warning_level')
    .where({ id })
    .update(updateData)
    .returning('*');

  return result ? mapToWarningLevel(result) : null;
};

export const deleteById = async (id: string): Promise<boolean> => {
  const result = await db('warning_level')
    .where({ id })
    .delete();

  return result > 0;
};

export const search = async (query: string): Promise<WarningLevel[]> => {
  const results = await db('warning_level')
    .where('name', 'ilike', `%${query}%`)
    .orWhere('description', 'ilike', `%${query}%`)
    .orderBy('name', 'asc')
    .select('*');

  return results.map(mapToWarningLevel);
};

const mapToWarningLevel = (row: any): WarningLevel => {
  return {
    id: row.id,
    name: row.name,
    description: row.description || null,
    createdAt: row.created_at ? new Date(row.created_at) : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
  };
};

import knex from 'knex';
import knexConfig from '../../knexfile';

import { WarningLevel, CreateWarningLevel } from '@shared/types/warningLevel.types';

const db = knex(knexConfig.development);

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

/**
 * Find all warning levels and include productCount for each level.
 * productCount = number of products with PAR level threshold > 0 associated to the warning level.
 */
export const findAllWithProductCount = async (): Promise<(WarningLevel & { productCount: number })[]> => {
  const results = await db('warning_level as wl')
    .leftJoin('par_level as pl', 'wl.id', 'pl.warning_level_id')
    .select(
      'wl.id',
      'wl.name',
      'wl.description',
      'wl.created_at',
      'wl.updated_at',
      // Sum of rows with treshold > 0; COALESCE to 0 when no rows
      db.raw('COALESCE(SUM(CASE WHEN pl.treshold > 0 THEN 1 ELSE 0 END), 0) as product_count'),
    )
    .groupBy('wl.id', 'wl.name', 'wl.description', 'wl.created_at', 'wl.updated_at')
    .orderBy('wl.name', 'asc');

  return results.map((row: any) => ({
    ...mapToWarningLevel(row),
    productCount: typeof row.product_count === 'string' ? parseInt(row.product_count, 10) : Number(row.product_count) || 0,
  }));
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

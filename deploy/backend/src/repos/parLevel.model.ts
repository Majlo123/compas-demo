import knex from 'knex';
import knexConfig from '../../knexfile';

const db = knex(knexConfig.development);

export type ParLevel = {
  prodId: string;
  threshold: number;
  warningLevelId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateParLevel = Omit<ParLevel, 'createdAt' | 'updatedAt'>;

export const create = async (data: CreateParLevel): Promise<ParLevel> => {
  const [result] = await db('par_level')
    .insert({
      prod_id: data.prodId,
      treshold: data.threshold,
      warning_level_id: data.warningLevelId,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning('*');

  return mapToParLevel(result);
};

export const findByProdId = async (prodId: string): Promise<ParLevel | null> => {
  const result = await db('par_level').where({ prod_id: prodId }).first();

  return result ? mapToParLevel(result) : null;
};

export const findByWarningLevelId = async (warningLevelId: string): Promise<ParLevel[]> => {
  const results = await db('par_level')
    .where({ warning_level_id: warningLevelId })
    .orderBy('prod_id', 'asc')
    .select('*');

  return results.map(mapToParLevel);
};

export const findAll = async (commodityGroups?: string[], search?: string): Promise<ParLevel[]> => {
  let query = db('par_level')
    .leftJoin('products', 'par_level.prod_id', 'products.prod_id')
    .leftJoin('live_stock', 'par_level.prod_id', 'live_stock.prod_id')
    .orderBy('par_level.prod_id', 'asc')
    .select(
      'par_level.*',
      'products.description as product_description',
      'products.commodity_group',
      'products.commodity_group_id',
      'live_stock.quantity'
    );

  // Apply commodity group filtering if provided
  if (commodityGroups && commodityGroups.length > 0) {
    query = query.whereIn('products.commodity_group', commodityGroups);
  }

  // Apply search filtering if provided
  if (search && search.trim()) {
    const searchTerm = `%${search.trim()}%`;
     query = query.where((qb) => {
       qb.whereRaw('products.description ilike ?', [searchTerm])
         .orWhereRaw('par_level.prod_id ilike ?', [searchTerm]);
     });
  }

  const results = await query;
  return results.map(row => ({
    prodId: row.prod_id,
    threshold: row.treshold,
    warningLevelId: row.warning_level_id,
    createdAt: row.created_at ? new Date(row.created_at) : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
    product_description: row.product_description,
    commodity_group: row.commodity_group,
    commodity_group_id: row.commodity_group_id,
    quantity: row.quantity,
  }));
};

export const updateByProdId = async (
  prodId: string,
  data: Partial<Omit<CreateParLevel, 'prodId'>>,
): Promise<ParLevel | null> => {
  const updateData: any = {
    updated_at: new Date(),
  };

  if (data.threshold !== undefined) updateData.treshold = data.threshold;
  if (data.warningLevelId !== undefined) updateData.warning_level_id = data.warningLevelId;

  const [result] = await db('par_level')
    .where({ prod_id: prodId })
    .update(updateData)
    .returning('*');

  return result ? mapToParLevel(result) : null;
};

export const deleteByProdId = async (prodId: string): Promise<boolean> => {
  const result = await db('par_level').where({ prod_id: prodId }).delete();

  return result > 0;
};

const mapToParLevel = (row: any): ParLevel => {
  return {
    prodId: row.prod_id,
    threshold: row.treshold,
    warningLevelId: row.warning_level_id,
    createdAt: row.created_at ? new Date(row.created_at) : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
  };
};

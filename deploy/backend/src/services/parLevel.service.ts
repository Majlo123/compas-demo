import knex from 'knex';
import * as parLevelRepository from 'repos/parLevel.model';
import * as warningLevelRepository from 'repos/warningLevel.model';
// eslint-disable-next-line no-restricted-imports
import knexConfig from '../../knexfile';

const db = knex(knexConfig.development);

/**
 * Get all PAR levels with optional commodity group filtering and search
 * @param commodityGroups - Optional array of commodity group names to filter by
 * @param search - Optional search term to filter by product description or ID
 */
export const findAll = async (
  commodityGroups?: string[],
  search?: string,
  warningLevelId?: string,
): Promise<any[]> => {
  return parLevelRepository.findAll(commodityGroups, search, warningLevelId);
};

/**
 * Get PAR level by product ID
 */
export const findByProdId = async (prodId: string): Promise<any | null> => {
  return parLevelRepository.findByProdId(prodId);
};

/**
 * Get all PAR levels by warning level ID
 */
export const findByWarningLevelId = async (warningLevelId: string): Promise<any[]> => {
  // Verify warning level exists
  const warningLevel = await warningLevelRepository.findById(warningLevelId);
  if (!warningLevel) {
    throw new Error('Warning level not found');
  }

  return parLevelRepository.findByWarningLevelId(warningLevelId);
};

/**
 * Create new PAR level
 */
export const create = async (data: {
  prodId: string;
  threshold: number;
  warningLevelId: string;
}): Promise<any> => {
  // Validate threshold is non-negative integer
  if (!Number.isInteger(data.threshold) || data.threshold < 0) {
    throw new Error('Threshold must be a non-negative integer');
  }

  // Check if product exists in live_stock
  const product = await db('live_stock').where({ prod_id: data.prodId }).first();

  if (!product) {
    throw new Error('Product not found in live_stock');
  }

  // Check if warning level exists
  const warningLevel = await warningLevelRepository.findById(data.warningLevelId);
  if (!warningLevel) {
    throw new Error('Warning level not found');
  }

  // Check if PAR level already exists for this product
  const existing = await parLevelRepository.findByProdId(data.prodId);
  if (existing) {
    throw new Error('PAR level already exists for this product');
  }

  return parLevelRepository.create({
    prodId: data.prodId,
    threshold: data.threshold,
    warningLevelId: data.warningLevelId,
  });
};

/**
 * Update PAR level
 */
export const update = async (
  prodId: string,
  data: {
    threshold?: number;
    warningLevelId?: string;
  },
): Promise<any> => {
  // Check if PAR level exists
  const existing = await parLevelRepository.findByProdId(prodId);
  if (!existing) {
    throw new Error('PAR level not found for this product');
  }

  // Validate threshold if provided
  if (data.threshold !== undefined) {
    if (!Number.isInteger(data.threshold) || data.threshold < 0) {
      throw new Error('Threshold must be a non-negative integer');
    }
  }

  // Verify warning level exists if provided
  if (data.warningLevelId !== undefined) {
    const warningLevel = await warningLevelRepository.findById(data.warningLevelId);
    if (!warningLevel) {
      throw new Error('Warning level not found');
    }
  }

  return parLevelRepository.updateByProdId(prodId, data);
};

/**
 * Delete PAR level
 */
export const deleteByProdId = async (prodId: string): Promise<boolean> => {
  const existing = await parLevelRepository.findByProdId(prodId);
  if (!existing) {
    throw new Error('PAR level not found for this product');
  }

  return parLevelRepository.deleteByProdId(prodId);
};

import * as warningLevelRepository from 'repos/warningLevel.model';

/**
 * Get all warning levels (includes productCount)
 */
export const findAll = async (): Promise<any[]> => {
  return warningLevelRepository.findAllWithProductCount();
};

/**
 * Get warning level by ID
 */
export const findById = async (id: string): Promise<any | null> => {
  return warningLevelRepository.findById(id);
};

/**
 * Create new warning level
 */
export const create = async (data: {
  name: string;
  description?: string | null;
}): Promise<any> => {
  // Check if name already exists
  const existing = await warningLevelRepository.findByName(data.name);
  if (existing) {
    throw new Error(`Warning level with name "${data.name}" already exists`);
  }

  return warningLevelRepository.create(data);
};

/**
 * Update warning level
 */
export const update = async (
  id: string,
  data: {
    name?: string;
    description?: string | null;
  }
): Promise<any> => {
  const existing = await warningLevelRepository.findById(id);
  if (!existing) {
    throw new Error('Warning level not found');
  }

  // Check if new name is already taken by another level
  if (data.name && data.name !== existing.name) {
    const duplicate = await warningLevelRepository.findByName(data.name);
    if (duplicate) {
      throw new Error(`Warning level with name "${data.name}" already exists`);
    }
  }

  return warningLevelRepository.updateById(id, data);
};

/**
 * Delete warning level
 */
export const delete_ = async (id: string): Promise<boolean> => {
  const existing = await warningLevelRepository.findById(id);
  if (!existing) {
    throw new Error('Warning level not found');
  }

  return warningLevelRepository.deleteById(id);
};

/**
 * Search warning levels
 */
export const search = async (query: string): Promise<any[]> => {
  if (!query || query.trim() === '') {
    return warningLevelRepository.findAll();
  }

  return warningLevelRepository.search(query.trim());
};

import { config } from '@/config/config';
import type { WarningLevel } from '@shared/types/warningLevel.types';
export type { WarningLevel } from '@shared/types/warningLevel.types';

const toSharedWarningLevel = (raw: any): WarningLevel => ({
  id: raw.id,
  name: raw.name,
  description: raw.description ?? null,
  createdAt: raw.createdAt ? new Date(raw.createdAt) : undefined,
  updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : undefined,
});

export const warningLevelApi = {
  /**
   * Fetch all warning levels from the API
   */
  getAll: async (): Promise<WarningLevel[]> => {
    const response = await fetch(`${config.backend.apiUrl}/warning-levels`);

    if (!response.ok) {
      throw new Error(`Failed to fetch warning levels: ${response.statusText}`);
    }

    const data = (await response.json()) as {
      success: boolean;
      content: any[];
    };
    return (data.content ?? []).map(toSharedWarningLevel);
  },

  /**
   * Fetch a single warning level by ID
   */
  getById: async (id: string): Promise<WarningLevel> => {
    const response = await fetch(
      `${config.backend.apiUrl}/warning-levels/${id}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch warning level: ${response.statusText}`);
    }

    const data = (await response.json()) as { success: boolean; content: any };
    return toSharedWarningLevel(data.content);
  },
};

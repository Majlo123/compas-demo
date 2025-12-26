import { config } from '@/config/config';
import type { WarningLevel } from '@shared/types/warningLevel.types';
export type { WarningLevel } from '@shared/types/warningLevel.types';

export type WarningLevelWithCount = WarningLevel & { productCount: number };

export type CreateWarningLevelInput = {
  name: string;
  description?: string | null;
};

const toSharedWarningLevel = (raw: any): WarningLevel => ({
  id: raw.id,
  name: raw.name,
  description: raw.description ?? null,
  createdAt: raw.createdAt ? new Date(raw.createdAt) : undefined,
  updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : undefined,
});

const toWarningLevelWithCount = (raw: any): WarningLevelWithCount => ({
  ...toSharedWarningLevel(raw),
  productCount: Number(raw.productCount ?? raw.product_count ?? 0),
});

export const warningLevelApi = {
  /**
   * Fetch all warning levels from the API
   */
  getAll: async (): Promise<WarningLevelWithCount[]> => {
    const response = await fetch(`${config.backend.apiUrl}/warning-levels`);

    if (!response.ok) {
      throw new Error(`Failed to fetch warning levels: ${response.statusText}`);
    }

    const data = (await response.json()) as {
      success: boolean;
      content: any[];
    };
    return (data.content ?? []).map(toWarningLevelWithCount);
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

  /**
   * Create a new warning level
   */
  create: async (input: CreateWarningLevelInput): Promise<WarningLevel> => {
    const response = await fetch(`${config.backend.apiUrl}/warning-levels`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `Failed to create warning level: ${response.statusText}`
      );
    }

    const data = (await response.json()) as { success: boolean; content: any };
    return toSharedWarningLevel(data.content);
  },
};

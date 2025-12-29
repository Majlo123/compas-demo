import { config } from '@/config/config';
import {
  ParLevel,
  mapParLevelDTOToParLevel,
  ParLevelDTO,
} from '@/types/parLevel.types';

export type { ParLevel } from '@/types/parLevel.types';

export const parLevelApi = {
  /**
   * Fetch all PAR levels from the API
   * @param commodityGroups - Optional array of commodity groups to filter by
   * @param search - Optional search term to filter by product description or ID
   */
  getAll: async (
    commodityGroups?: string[],
    search?: string
  ): Promise<ParLevel[]> => {
    const params = new URLSearchParams();

    if (commodityGroups && commodityGroups.length > 0) {
      commodityGroups.forEach((group) =>
        params.append('commodityGroups', group)
      );
    }

    if (search && search.trim()) {
      params.append('search', search.trim());
    }

    let url = `${config.backend.apiUrl}/par-levels`;
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch PAR levels: ${response.statusText}`);
    }

    const data = (await response.json()) as {
      success: boolean;
      content: ParLevelDTO[];
    };

    return (data.content ?? []).map(mapParLevelDTOToParLevel);
  },

  /**
   * Fetch PAR levels by warning level id (returns minimal rows: prodId, threshold, etc.)
   */
  getByWarningLevelId: async (
    warningLevelId: string
  ): Promise<
    {
      prodId: string;
      threshold: number;
      warningLevelId: string;
    }[]
  > => {
    const response = await fetch(
      `${config.backend.apiUrl}/par-levels/warning-level/${warningLevelId}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch by warning level: ${response.statusText}`
      );
    }

    const data = (await response.json()) as {
      success: boolean;
      content: Array<{
        prodId: string;
        threshold: number;
        warningLevelId: string;
      }>;
    };

    return data.content ?? [];
  },

  /**
   * Fetch a single PAR level by product ID
   */
  getByProdId: async (prodId: string): Promise<ParLevel | null> => {
    const response = await fetch(
      `${config.backend.apiUrl}/par-levels/${prodId}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch PAR level: ${response.statusText}`);
    }

    const data = (await response.json()) as {
      success: boolean;
      content: ParLevelDTO;
    };

    return data.content ? mapParLevelDTOToParLevel(data.content) : null;
  },

  /**
   * Update an existing PAR level threshold
   */
  updateThreshold: async (
    prodId: string,
    threshold: number
  ): Promise<ParLevel | null> => {
    const response = await fetch(
      `${config.backend.apiUrl}/par-levels/${prodId}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threshold }),
      }
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      const text = await response.text();
      throw new Error(`Failed to update PAR level: ${response.status} ${text}`);
    }

    const data = (await response.json()) as {
      success: boolean;
      content: ParLevelDTO;
    };

    return data.content ? mapParLevelDTOToParLevel(data.content) : null;
  },

  /**
   * Create a new PAR level entry
   */
  create: async (
    prodId: string,
    threshold: number,
    warningLevelId: string
  ): Promise<ParLevel> => {
    const response = await fetch(`${config.backend.apiUrl}/par-levels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prodId, threshold, warningLevelId }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to create PAR level: ${response.status} ${text}`);
    }

    const data = (await response.json()) as {
      success: boolean;
      content: ParLevelDTO;
    };

    return mapParLevelDTOToParLevel(data.content);
  },
};

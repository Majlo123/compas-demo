import { config } from '@/config/config';
import { ParLevel, mapParLevelDTOToParLevel } from '@/types/parLevel.types';

export type { ParLevel } from '@/types/parLevel.types';

export type ParLevelDTO = {
  prodId: string;
  threshold: number;
  warningLevelId: string;
  createdAt?: Date;
  updatedAt?: Date;
  product_description?: string;
  commodity_group?: string;
  commodity_group_id?: string;
  quantity?: number;
};

export const parLevelApi = {
  /**
   * Fetch all PAR levels from the API
   */
  getAll: async (commodityGroups?: string[]): Promise<ParLevel[]> => {
    let url = `${config.backend.apiUrl}/par-levels`;
    
    if (commodityGroups && commodityGroups.length > 0) {
      const params = new URLSearchParams();
      commodityGroups.forEach(group => params.append('commodityGroups', group));
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
};

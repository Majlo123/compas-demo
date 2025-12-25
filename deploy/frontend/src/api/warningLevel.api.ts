import { config } from '@/config/config';

export interface WarningLevel {
  id: string;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface WarningLevelsResponse {
  success: boolean;
  content: WarningLevel[];
}

export const warningLevelApi = {
  /**
   * Fetch all warning levels from the API
   */
  getAll: async (): Promise<WarningLevel[]> => {
    const response = await fetch(`${config.backend.apiUrl}/warning-levels`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch warning levels: ${response.statusText}`);
    }
    
    const data: WarningLevelsResponse = await response.json();
    return data.content;
  },

  /**
   * Fetch a single warning level by ID
   */
  getById: async (id: string): Promise<WarningLevel> => {
    const response = await fetch(`${config.backend.apiUrl}/warning-levels/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch warning level: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.content;
  },
};

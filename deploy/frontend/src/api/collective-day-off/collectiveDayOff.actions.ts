import axiosServer from '@/services/axios';
import { ApiResponse } from '@/api/shared.types';
import { formatError } from '@/api/handle.error';
import { CollectiveDayOff, CreateCollectiveDayOffRequest } from '../../../../shared/collectiveDayOff.types';

const endpoint = '/collective-days-off';

export const getAllCollectiveDaysOff = async (): Promise<ApiResponse<CollectiveDayOff[]>> => {
  try {
    const response = await axiosServer.get(endpoint);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const createCollectiveDayOff = async (
  data: CreateCollectiveDayOffRequest
): Promise<ApiResponse<CollectiveDayOff>> => {
  try {
    const response = await axiosServer.post(endpoint, data);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const deleteCollectiveDayOff = async (id: string): Promise<ApiResponse<{ deleted: boolean }>> => {
  try {
    const response = await axiosServer.delete(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

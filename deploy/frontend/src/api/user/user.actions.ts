import axiosServer from '@/services/axios';
import { ApiResponse } from '@/api/shared.types';
import { formatError } from '@/api/handle.error';
import { User } from './user.types';

const endpoint = '/user';

export const searchUsers = async (query: string): Promise<ApiResponse<User[]>> => {
  try {
    const response = await axiosServer.get(`${endpoint}/search`, {
      params: { query }
    });
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

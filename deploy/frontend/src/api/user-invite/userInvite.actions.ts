import axiosServer from '@/services/axios';
import { ApiResponse } from '@/api/shared.types';
import { formatError } from '@/api/handle.error';

const endpoint = '/user-invite';

export const verifyInviteToken = async (token: string): Promise<ApiResponse<{ email: string }>> => {
  try {
    const response = await axiosServer.post(`${endpoint}/verify`, { token });
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

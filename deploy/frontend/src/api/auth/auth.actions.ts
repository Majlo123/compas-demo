import { formatError } from '@/api/handle.error';
import { LoginRequest, LoginResponse } from '@/api/auth/auth.types';
import { ApiResponse } from '@/api/shared.types';
import axiosServer from '@/services/axios';
import { removeFromLocalStorage } from '@/services/local.storage';

const endpoint = '/auth';

export const login = async (
  credentials: LoginRequest
): Promise<ApiResponse<LoginResponse>> => {
  try {
    const response = await axiosServer.post(`${endpoint}/login`, credentials);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const logout = (): void => {
  removeFromLocalStorage('token');
  removeFromLocalStorage('user');
};

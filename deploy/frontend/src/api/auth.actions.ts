import { formatError } from '@/api/handle.error';
import { LoginRequest, LoginResponse, ChangePasswordRequest } from '../../../shared/auth.types';
import { RegisterRequest,RegisterResponse } from '../../../shared/auth.types';
import { ApiResponse } from '@/api/shared.types';
import axiosServer from '@/services/axios';

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

export const register = async (
  data: RegisterRequest
): Promise<ApiResponse<RegisterResponse>> => {
  try {
    const response = await axiosServer.post(`${endpoint}/register`, data);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const changePassword = async (
  data: ChangePasswordRequest
): Promise<ApiResponse<{ success: boolean; message: string }>> => {
  try {
    const response = await axiosServer.patch(`${endpoint}/change-password`, {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

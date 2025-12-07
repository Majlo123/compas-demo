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

export const getUsers = async (page = 1, pageSize = 10): Promise<ApiResponse<any>> => {
  try {
    const response = await axiosServer.get(`${endpoint}`, {
      params: { page, pageSize }
    });
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const inviteUsers = async (emails: string[]): Promise<ApiResponse<{ 
  invited: string[]; 
  skipped: string[]; 
  failed: Array<{ email: string; reason: string }> 
}>> => {
  try {
    const response = await axiosServer.post(`${endpoint}/invite`, { emails });
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const deactivateUser = async (userId: string): Promise<ApiResponse<{ deactivated: boolean }>> => {
  try {
    const response = await axiosServer.delete(`${endpoint}/${userId}`);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const getUserProfile = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await axiosServer.get(`${endpoint}/profile`);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const updateEmailNotificationPreference = async (emailNotificationsEnabled: boolean): Promise<ApiResponse<{ emailNotificationsEnabled: boolean }>> => {
  try {
    const response = await axiosServer.put(`${endpoint}/email-notification-preference`, { 
      emailNotificationsEnabled 
    });
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

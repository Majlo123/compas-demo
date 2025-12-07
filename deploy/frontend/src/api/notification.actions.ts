import axios from 'axios';
import { config } from '@/config/config';
import { getFromLocalStorage } from '@/services/local.storage';
import { ApiResponse } from './shared.types';

export interface LeaveRequestNotification {
  id: string;
  userId: string;
  leaveRequestId: string;
  title: string;
  isRead: boolean;
  createdAt: Date;
}

export const fetchUnreadNotifications = async (): Promise<
  ApiResponse<LeaveRequestNotification[]>
> => {
  try {
    const token = getFromLocalStorage('token');
    const response = await axios.get(`${config.backend.apiUrl}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: {
        code: error.response?.status || 500,
        message: error.response?.data?.error?.message || 'Failed to fetch notifications',
      },
    };
  }
};

export const markNotificationAsRead = async (
  notificationId: string,
): Promise<ApiResponse<LeaveRequestNotification>> => {
  try {
    const token = getFromLocalStorage('token');
    const response = await axios.patch(
      `${config.backend.apiUrl}/notifications/${notificationId}/read`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: {
        code: error.response?.status || 500,
        message: error.response?.data?.error?.message || 'Failed to mark notification as read',
      },
    };
  }
};

export const markAllNotificationsAsRead = async (): Promise<
  ApiResponse<{ count: number }>
> => {
  try {
    const token = getFromLocalStorage('token');
    const response = await axios.patch(
      `${config.backend.apiUrl}/notifications/read-all`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: {
        code: error.response?.status || 500,
        message:
          error.response?.data?.error?.message || 'Failed to mark all notifications as read',
      },
    };
  }
};

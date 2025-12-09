import { formatError } from '@/api/handle.error';
import {
  Widget,
  CreateWidgetData,
  WidgetListResponse,
  WidgetLayoutItem,
  SaveWidgetsLayoutRequest,
} from '@/api/widget/widget.types';
import { ApiResponse } from '@/api/shared.types';
import axiosServer from '@/services/axios';

const endpoint = '/widgets';

export const getWidget = async (id: string): Promise<ApiResponse<Widget>> => {
  try {
    const response = await axiosServer.get(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const getWidgetsByUser = async (userId: string, type?: string): Promise<ApiResponse<WidgetListResponse>> => {
  try {
    const query = type ? `?type=${encodeURIComponent(type)}` : '';
    const response = await axiosServer.get(`${endpoint}/user/${userId}${query}`);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const createWidget = async (data: CreateWidgetData): Promise<ApiResponse<Widget>> => {
  try {
    const response = await axiosServer.post(endpoint, data);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const updateWidget = async (id: string, data: Partial<CreateWidgetData>): Promise<ApiResponse<Widget>> => {
  try {
    const response = await axiosServer.put(`${endpoint}/${id}`, data);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const deleteWidget = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const response = await axiosServer.delete(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const saveWidgetsLayout = async (userId: string, widgets: WidgetLayoutItem[]): Promise<ApiResponse<Widget[]>> => {
  try {
    const payload: SaveWidgetsLayoutRequest = { widgets };
    const response = await axiosServer.post(`${endpoint}/user/${userId}/layout`, payload);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

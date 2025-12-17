import { formatError } from '@/api/handle.error';
import { ApiResponse } from '@/api/shared.types';
import axiosServer from '@/services/axios';
import QueryParams from '@/types/query/QueryParams';
import { Client, CreateClientData, UpdateClientData } from '@shared/client.types';

const endpoint = '/clients';

export const getClients = async (
  params?: QueryParams
): Promise<ApiResponse<{ data: Client[]; page?: number; pageSize?: number; totalItems?: number; totalPages?: number }>> => {
  try {
    const queryParams = new URLSearchParams();

    if (params?.pagination?.page) queryParams.append('page', params.pagination.page.toString());
    if (params?.pagination?.pageSize) queryParams.append('pageSize', params.pagination.pageSize.toString());
    if (params?.sort?.by) queryParams.append('by', params.sort.by);
    if (params?.sort?.direction) queryParams.append('direction', params.sort.direction);
    if (params?.filters && params.filters.length > 0) {
      queryParams.append('filter', JSON.stringify(params.filters));
    }

    const queryString = queryParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    const response = await axiosServer.get(url);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const getClient = async (id: string): Promise<ApiResponse<Client>> => {
  try {
    const response = await axiosServer.get(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const createClient = async (data: CreateClientData): Promise<ApiResponse<Client>> => {
  try {
    const response = await axiosServer.post(endpoint, data);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const updateClient = async (
  id: string,
  data: UpdateClientData,
): Promise<ApiResponse<Client>> => {
  try {
    const response = await axiosServer.put(`${endpoint}/${id}`, data);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const getClientProjects = async (
  id: string,
): Promise<ApiResponse<{ data: any[] }>> => {
  try {
    const response = await axiosServer.get(`${endpoint}/${id}/projects`);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const assignProjectToClient = async (
  clientId: string,
  projectId: string,
): Promise<ApiResponse<{ success: boolean }>> => {
  try {
    const response = await axiosServer.post(`${endpoint}/${clientId}/projects/${projectId}`);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const unassignProjectFromClient = async (
  clientId: string,
  projectId: string,
): Promise<ApiResponse<{ success: boolean }>> => {
  try {
    const response = await axiosServer.delete(`${endpoint}/${clientId}/projects/${projectId}`);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

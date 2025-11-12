import { formatError } from '@/api/handle.error';
import {
  OrganizationCreate,
  OrganizationResponse,
} from '@/api/organization/organization.types';
import { ApiResponse, PaginatedApiResponse } from '@/api/shared.types';
import axiosServer from '@/services/axios';

const endpoint = '/organization';

export const findOrganizationById = async (
  id: string
): Promise<ApiResponse<{ organization: OrganizationResponse }>> => {
  try {
    const response = await axiosServer.get(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const createOrganization = async (
  data: OrganizationCreate
): Promise<ApiResponse<{ organization: OrganizationResponse }>> => {
  try {
    const response = await axiosServer.post(endpoint, data);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const findAllOrganizations = async (params: {
  [key: string]: any;
}): Promise<PaginatedApiResponse<OrganizationResponse>> => {
  try {
    const response = await axiosServer.get(endpoint, {
      params,
    });
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const updateOrganization = async (
  id: string,
  data: OrganizationCreate
): Promise<ApiResponse<{ organization: OrganizationResponse }>> => {
  try {
    const response = await axiosServer.put(`${endpoint}/${id}`, data);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const deleteOrganization = async (
  id: string
): Promise<ApiResponse<{ organization: OrganizationResponse }>> => {
  try {
    const response = await axiosServer.delete(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

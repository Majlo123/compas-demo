import { formatError } from '@/api/handle.error';
import { ApiResponse } from '@/api/shared.types';
import axiosServer from '@/services/axios';
import { Team, CreateTeamData, PaginatedTeamResponse } from './team.types';
import QueryParams from '@/types/query/QueryParams';

const endpoint = '/team';

export const getTeams = async (
  params?: QueryParams
): Promise<ApiResponse<{ data: Team[]; page?: number; pageSize?: number }>> => {
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

export const createTeam = async (
  data: CreateTeamData
): Promise<ApiResponse<Team>> => {
  try {
    const response = await axiosServer.post(endpoint, data);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const deleteTeam = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const response = await axiosServer.delete(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const listTeamMembers = async (teamId: string): Promise<ApiResponse<any[]>> => {
  try {
    const response = await axiosServer.get(`${endpoint}/${teamId}/members`);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

import { formatError } from '@/api/handle.error';
import {
  LeaveRequestListResponse, LeaveRequest, CreateLeaveRequestData,
  PaginatedLeaveRequestResponse,
} from '@/api/leave-request/leaveRequest.types';
import { ApiResponse } from '@/api/shared.types';
import axiosServer from '@/services/axios';
import QueryParams from '@/types/query/QueryParams';

const endpoint = '/leave-request';

export const getMyLeaveRequests = async (): Promise<ApiResponse<LeaveRequestListResponse>> => {
  try {
    const response = await axiosServer.get(`${endpoint}/my-requests`);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const createLeaveRequest = async (
  data: CreateLeaveRequestData
): Promise<ApiResponse<LeaveRequest>> => {
  try {
    const response = await axiosServer.post(endpoint, data);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const getTeamLeaveRequests = async (
  params?: QueryParams
): Promise<ApiResponse<PaginatedLeaveRequestResponse>> => {
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
    const url = queryString ? `${endpoint}/team-requests?${queryString}` : `${endpoint}/team-requests`;
    const response = await axiosServer.get(url);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const getCalendarLeaveRequests = async (): Promise<ApiResponse<LeaveRequestListResponse>> => {
  try {
    const response = await axiosServer.get(`${endpoint}/calendar`);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const updateLeaveRequestStatus = async (
  id: string,
  status: 'approved' | 'declined'
): Promise<ApiResponse<LeaveRequest>> => {
  try {
    const response = await axiosServer.patch(`${endpoint}/${id}/status`, { status });
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

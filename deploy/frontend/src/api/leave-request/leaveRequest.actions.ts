import { formatError } from '@/api/handle.error';
import {
  LeaveRequestListResponse,
  PaginatedLeaveRequestResponse,
} from '@/api/leave-request/leaveRequest.types';
import { ApiResponse, QueryParams } from '@/api/shared.types';
import axiosServer from '@/services/axios';

const endpoint = '/leave-request';

export const getMyLeaveRequests = async (): Promise<ApiResponse<LeaveRequestListResponse>> => {
  try {
    const response = await axiosServer.get(`${endpoint}/my-requests`);
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

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.by) queryParams.append('by', params.by);
    if (params?.direction) queryParams.append('direction', params.direction);

    const queryString = queryParams.toString();
    const url = queryString ? `${endpoint}/team-requests?${queryString}` : `${endpoint}/team-requests`;

    const response = await axiosServer.get(url);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

import { formatError } from '@/api/handle.error';
import { LeaveRequestListResponse, LeaveRequest, CreateLeaveRequestData } from '@/api/leave-request/leaveRequest.types';
import { ApiResponse } from '@/api/shared.types';
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

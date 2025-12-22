import axiosServer from '@/services/axios';
import { ApiResponse } from '@/api/shared.types';
import { formatError } from '@/api/handle.error';
import { TimeEntry, CreateTimeEntryRequest, UpdateTimeEntryRequest } from '../../../../shared/timeEntry.types';

const endpoint = '/time-entries';

/**
 * Get all time entries for the current user with optional date range filtering
 */
export const getTimeEntries = async (
  startDate?: string,
  endDate?: string
): Promise<ApiResponse<TimeEntry[]>> => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const url = params.toString() ? `${endpoint}?${params.toString()}` : endpoint;
    const response = await axiosServer.get(url);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

/**
 * Create a new time entry
 */
export const createTimeEntry = async (
  data: CreateTimeEntryRequest
): Promise<ApiResponse<TimeEntry>> => {
  try {
    const response = await axiosServer.post(endpoint, data);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

/**
 * Update an existing time entry
 */
export const updateTimeEntry = async (
  id: string,
  data: UpdateTimeEntryRequest
): Promise<ApiResponse<TimeEntry>> => {
  try {
    const response = await axiosServer.put(`${endpoint}/${id}`, data);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

/**
 * Delete a time entry
 */
export const deleteTimeEntry = async (
  id: string
): Promise<ApiResponse<{ deleted: boolean }>> => {
  try {
    const response = await axiosServer.delete(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

/**
 * Get a single time entry by ID
 */
export const getTimeEntryById = async (
  id: string
): Promise<ApiResponse<TimeEntry>> => {
  try {
    const response = await axiosServer.get(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

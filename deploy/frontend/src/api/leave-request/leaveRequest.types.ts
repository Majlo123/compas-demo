export type LeaveRequestStatus = 'approved' | 'pending' | 'declined';

export type LeaveRequestType = 'vacation' | 'sick' | 'personal' | 'other';

export type LeaveRequest = {
  id: string;
  type: LeaveRequestType;
  startDate: string;
  endDate: string;
  status: LeaveRequestStatus;
  reason?: string;
  createdAt: string;
};

export type LeaveRequestWithEmployee = LeaveRequest & {
  employeeName?: string;
};

export type LeaveRequestListResponse = LeaveRequest[];

export type CreateLeaveRequestData = {
  type: LeaveRequestType;
  startDate: string;
  endDate: string;
  reason?: string;
};

export type PaginatedLeaveRequestResponse = {
  data: LeaveRequest[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

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

export type LeaveRequestListResponse = LeaveRequest[];

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/controls/button/Button';
import Table, { Column, Row } from '@/components/controls/table/Table';
import StatusBadge from '@/components/controls/badge/StatusBadge';
import { getMyLeaveRequests, createLeaveRequest } from '@/api/leave-request/leaveRequest.actions';
import { LeaveRequest, LeaveRequestStatus, LeaveRequestType } from '@/api/leave-request/leaveRequest.types';
import DialogForm from '@/components/dialog/DialogForm';

interface LeaveRequestRow extends Row {
  type: string;
  startDate: string;
  endDate: string;
  status: LeaveRequestStatus;
}

const MyLeaveRequestsPage: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      // Debug: check token
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);
      }
      
      const response = await getMyLeaveRequests();
      console.log('Leave requests response:', response);

      if (response.success && response.content) {
        const formattedData: LeaveRequestRow[] = response.content.map((request: LeaveRequest) => ({
          _id: request.id,
          type: formatLeaveType(request.type),
          startDate: formatDate(request.startDate),
          endDate: formatDate(request.endDate),
          status: request.status,
        }));
        setLeaveRequests(formattedData);
      } else {
        console.error('Failed to fetch leave requests:', response);
        setHasError(true);
        toast.error(response.message || 'Failed to load leave requests. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      setHasError(true);
      toast.error('Failed to load leave requests. Please try again.');
    }

    setIsLoading(false);
  };

  const formatLeaveType = (type: string): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleNewRequest = () => {
    setDialogOpen(true);
  };

  const handleFormSubmit = async (data: { type: LeaveRequestType; startDate: string; endDate: string }) => {
    const response = await createLeaveRequest(data);

    if (response.success) {
      toast.success(response.message || 'Leave request submitted successfully');
      setDialogOpen(false);
      fetchLeaveRequests();
    } else {
      toast.error(response.message || 'Failed to submit leave request. Please try again.');
      throw new Error(response.message);
    }
  };

  const columns: Column[] = [
    {
      accessor: 'type',
      header: 'Type',
    },
    {
      accessor: 'startDate',
      header: 'Start Date',
    },
    {
      accessor: 'endDate',
      header: 'End Date',
    },
    {
      accessor: 'status',
      header: 'Status',
      formatter: (value: LeaveRequestStatus) => (
        <StatusBadge status={value}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </StatusBadge>
      ),
    },
  ];

  return (
    <>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-h1 font-extrabold text-gray-800">My Leave Requests</h1>
        <Button onClick={handleNewRequest} className="text-l font-medium">
          + New Leave Request
        </Button>
      </div>

      {/* Content Area */}
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : hasError ? (
          <div className="flex flex-col justify-center items-center py-12 text-center">
            <p className="text-gray-500 text-lg mb-4">Failed to load leave requests</p>
            <Button onClick={fetchLeaveRequests} variant="primary" size="md">
              Try Again
            </Button>
          </div>
        ) : leaveRequests.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-12 text-center">
            <p className="text-gray-500 text-lg mb-2">No leave requests yet</p>
            <p className="text-gray-400 text-sm">
              Click "New Leave Request" to submit your first request
            </p>
          </div>
        ) : (
          <Table
            columns={columns}
            data={leaveRequests}
            tableClassName="text-p2 lg:text-p1"
            headerClassName="text-p2 lg:text-p1 font-bold"
            cellClassName="text-p2 lg:text-p1"
          />
        )}
      </div>
      <DialogForm 
        isOpen={dialogOpen} 
        onOpenChange={setDialogOpen}
        onSubmit={handleFormSubmit}
      />
    </>
  );
};

export default MyLeaveRequestsPage;

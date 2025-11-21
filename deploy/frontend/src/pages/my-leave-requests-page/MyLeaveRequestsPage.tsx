import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/controls/button/Button';
import Table, { Column, Row } from '@/components/controls/table/Table';
import StatusBadge from '@/components/controls/badge/StatusBadge';
import { getMyLeaveRequests } from '@/api/leave-request/leaveRequest.actions';
import { LeaveRequest, LeaveRequestStatus } from '@/api/leave-request/leaveRequest.types';
import DialogForm from '@/components/dialog/DialogForm';
import RequestsLayout from '@/components/layout/RequestsLayout';

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

    const response = await getMyLeaveRequests();

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
      setHasError(true);
      toast.error(response.message || 'Failed to load leave requests. Please try again.');
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
    <RequestsLayout
      title="My Leave Requests"
      action={
        <Button onClick={handleNewRequest}>
          + New Leave Request
        </Button>
      }
      isLoading={isLoading}
      hasError={hasError}
      isEmpty={leaveRequests.length === 0}
      onRetry={fetchLeaveRequests}
      emptyMessage="No leave requests yet"
      emptyDescription="Click 'New Leave Request' to submit your first request"
    >
      <Table
        columns={columns}
        data={leaveRequests}
        tableClassName="text-sm lg:text-md"
        headerClassName="text-sm lg:text-md font-bold"
        cellClassName="text-sm lg:text-md"
      />
      <DialogForm isOpen={dialogOpen} onOpenChange={setDialogOpen} />
    </RequestsLayout>
  );
};

export default MyLeaveRequestsPage;

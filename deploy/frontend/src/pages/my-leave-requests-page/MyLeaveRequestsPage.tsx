import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '@/components/controls/button/Button';
import Table, { Column, Row } from '@/components/controls/table/Table';
import StatusBadge from '@/components/controls/badge/StatusBadge';
import PageLayout from '@/components/layout/PageLayout';
import { getMyLeaveRequests, createLeaveRequest, updateLeaveRequest, cancelLeaveRequest } from '@/api/leave-request/leaveRequest.actions';
import { LeaveRequest, LeaveRequestStatus, LeaveRequestType } from '@/api/leave-request/leaveRequest.types';
import DialogLeaveRequestForm from '@/components/dialog/DialogLeaveRequestForm';
import TableIconEdit from '@/components/images/TableIconEdit';
import { isApiSuccess } from '@/api/shared.types';

interface LeaveRequestRow extends Row {
  type: string;
  startDate: string;
  endDate: string;
  status: LeaveRequestStatus;
  rawData: LeaveRequest;
}

const MyLeaveRequestsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<LeaveRequest | null>(null);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [requestIdFilter, setRequestIdFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaveRequests();
  }, [requestIdFilter]);

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
        let content = response.content;
        if (requestIdFilter) {
          content = content.filter((r) => r.id === requestIdFilter);
        }
        const formattedData: LeaveRequestRow[] = content.map((request: LeaveRequest) => ({
          _id: request.id,
          type: formatLeaveType(request.type),
          startDate: formatDate(request.startDate),
          endDate: formatDate(request.endDate),
          status: request.status,
          rawData: request,
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

  // Load requestId filter from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reqId = params.get('requestId');
    if (reqId) setRequestIdFilter(reqId);
  }, [location.search]);

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
    setEditingRequest(null);
    setDialogOpen(true);
  };

  const handleEdit = (row: LeaveRequestRow) => {
    setEditingRequest(row.rawData);
    setDialogOpen(true);
  };

  const handleFormSubmit = async (data: { type: LeaveRequestType; startDate: string; endDate: string }) => {
    if (editingRequest) {
      const response = await updateLeaveRequest(editingRequest.id, data);

      if (isApiSuccess(response)) {
        toast.success(response.message || 'Leave request updated successfully');
        setDialogOpen(false);
        setEditingRequest(null);
        fetchLeaveRequests();
      } else {
        toast.error(response.message || 'Failed to update leave request. Please try again.');
        throw new Error(response.message);
      }
    } else {
      const response = await createLeaveRequest(data);

      if (response.success) {
        toast.success(response.message || 'Leave request submitted successfully');
        setDialogOpen(false);
        fetchLeaveRequests();
      } else {
        toast.error(response.message || 'Failed to submit leave request. Please try again.');
        throw new Error(response.message);
      }
    }
  };

  const handleCancelRequest = async () => {
    if (editingRequest) {
      const response = await cancelLeaveRequest(editingRequest.id);

      if (isApiSuccess(response)) {
        toast.success(response.message || 'Leave request cancelled successfully');
        setDialogOpen(false);
        setEditingRequest(null);
        fetchLeaveRequests();
      } else {
        toast.error(response.message || 'Failed to cancel leave request. Please try again.');
        throw new Error(response.message);
      }
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
      formatter: (value: LeaveRequestStatus, row: LeaveRequestRow) => (
        <div className="flex items-center gap-2">
          <StatusBadge status={value}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </StatusBadge>
          {row.status === 'pending' && (
            <Button
              variant="edit"
              onClick={() => handleEdit(row)}
              size="sm"
              Icon={TableIconEdit}
            >
              <span className='self-center'>Edit</span>
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageLayout
        title="My Leave Requests"
        action={
          <div className="flex gap-3 items-center">
            <Button onClick={handleNewRequest} className="text-lg font-medium">
              + New Leave Request
            </Button>
            {requestIdFilter && (
              <Button onClick={() => {
                setRequestIdFilter(null);
                const params = new URLSearchParams(location.search);
                params.delete('requestId');
                navigate({ pathname: location.pathname, search: params.toString() });
              }} className="text-lg font-medium">
                Show all
              </Button>
            )}
          </div>
        }
        actionPosition="inline"
        emptyMessage="No leave requests yet"
        emptyDescription="Click 'New Leave Request' to submit your first request"
        isLoading={isLoading}
        hasError={hasError}
        isEmpty={leaveRequests.length === 0}
        onRetry={fetchLeaveRequests}
      >
        <Table
          columns={columns}
          data={leaveRequests}
          tableClassName="text-p2 lg:text-p1"
          headerClassName="text-p2 lg:text-p1 font-bold"
          cellClassName="text-p2 lg:text-p1"
        />
      </PageLayout>
      <DialogLeaveRequestForm 
          isOpen={dialogOpen} 
          onOpenChange={setDialogOpen}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelRequest}
          initialData={editingRequest ? {
            type: editingRequest.type,
            startDate: editingRequest.startDate,
            endDate: editingRequest.endDate,
          } : undefined}
          mode={editingRequest ? 'edit' : 'create'}
        />
    </>
  );
};

export default MyLeaveRequestsPage;

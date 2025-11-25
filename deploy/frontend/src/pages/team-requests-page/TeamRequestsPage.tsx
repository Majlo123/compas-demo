import { LeaveRequestStatus, LeaveRequestWithEmployee } from '@/api/leave-request/leaveRequest.types';
import StatusBadge from '@/components/controls/badge/StatusBadge';
import Table, { Column } from '@/components/controls/table/Table';
import RequestsLayout from '@/components/layout/RequestsLayout';
import React, { useState, useEffect } from 'react';
import Select from '@/components/controls/Select';
import { SelectOption } from '@/components/controls/Select';
import BadgeIconCheckCircle from '@/components/images/BadgeIconCheckCircle';
import BadgeIconXCircle from '@/components/images/BadgeIconXCircle';
import usePagination from '@/hooks/usePagination';
import useSort from '@/hooks/useSort';
import { getTeamLeaveRequests, updateLeaveRequestStatus } from '@/api/leave-request/leaveRequest.actions';
import { isApiSuccess } from '@/api/shared.types';
import QueryParams from '@/types/query/QueryParams';
import { PAGE_SIZES } from '@/types/query/QueryPagination';
import { toast } from 'react-toastify';

const TeamRequestsPage: React.FC = () => {
  const { page, pageSize } = usePagination();
  const { sort } = useSort();
  
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestWithEmployee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const filterOptions: SelectOption[] = [
    { label: 'Vacation', value: 'vacation' },
    { label: 'Sick Leave', value: 'sick' },
    { label: 'Personal Leave', value: 'personal' },
    { label: 'Unpaid', value: 'other' },
  ];

  const statusOptions: SelectOption[] = [
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Declined', value: 'declined' },
  ];

  const [search, setSearch] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<SelectOption | null>(null);  const [selectedStatus, setSelectedStatus] = useState<SelectOption | null>(null);

  const fetchTeamLeaveRequests = async () => {
    setIsLoading(true);
    setHasError(false);

    const queryParams: QueryParams = {
      pagination: { page, pageSize: pageSize as typeof PAGE_SIZES[number] },
      sort: sort.by && sort.direction ? { by: sort.by, direction: sort.direction } : undefined,
    };

    const response = await getTeamLeaveRequests(queryParams);

    if (isApiSuccess(response)) {
      setLeaveRequests(response.content.data);
      setTotalPages(response.content.totalPages);
      setTotalItems(response.content.totalItems);
    } else {
      setHasError(true);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchTeamLeaveRequests();
  }, [page, pageSize, sort.by, sort.direction]);

  const handleStatusUpdate = async (id: string, status: 'approved' | 'declined') => {
    const response = await updateLeaveRequestStatus(id, status);

    if (isApiSuccess(response)) {
      toast.success(response.message || `Leave request ${status} successfully`);
      fetchTeamLeaveRequests();
    } else {
      toast.error(response.error?.message || `Failed to ${status} leave request`);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

    const columns: Column[] = [
        {
          accessor: 'employeeName',
          header: 'Team Member',
        },
        {
          accessor: 'type',
          header: 'Type',
        },
        {
          accessor: 'startDate',
          header: 'Start Date',
          formatter: (value: string) => formatDate(value),
        },
        {
          accessor: 'endDate',
          header: 'End Date',
          formatter: (value: string) => formatDate(value),
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
        {
          accessor: 'actions',
          header: 'Actions',
          formatter: (_value: any, row: any) => {
            if (row.status !== 'pending') {
              return null;
            }
            return (
              <div className="flex gap-2 items-center justify-center">
                <div
                  onClick={() => handleStatusUpdate(row.id, 'approved')}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <StatusBadge status="approved">
                    <BadgeIconCheckCircle className="w-4 h-4" />
                  </StatusBadge>
                </div>
                <div
                  onClick={() => handleStatusUpdate(row.id, 'declined')}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <StatusBadge status="declined">
                    <BadgeIconXCircle className="w-4 h-4" />
                  </StatusBadge>
                </div>
              </div>
            );
          },
        },
      ];

  return (
    <RequestsLayout
      title="Team Requests"
      action={
        <div className="flex gap-3 items-center xl:w-1/2">
            <div className="relative flex-1">
              <input
                id="team-requests-search"
                placeholder="Search by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded-lg bg-transparent border-someGrey p-md text-p2 text-darkGrey"
              />
            </div>
            <Select className="text-p1 flex-1" placeholder="Filter by" options={filterOptions} value={selectedFilter} onChange={setSelectedFilter} />
            <Select className="text-p1 flex-1" placeholder="Status" options={statusOptions} value={selectedStatus} onChange={setSelectedStatus} />
        </div>
      }
      actionPosition="below"
      emptyMessage="No team requests yet"
      emptyDescription="Your team members have not submitted any leave requests."
        isLoading={isLoading}
        hasError={hasError}
        isEmpty={leaveRequests.length === 0}
    >
      <Table
        columns={columns}
        data={leaveRequests.map(lr => ({ ...lr, _id: lr.id }))}
        tableClassName="text-p2 lg:text-p1"
        headerClassName="text-p2 lg:text-p1 font-bold"
        cellClassName="text-p2 lg:text-p1"
      />
    </RequestsLayout>
  );
};

export default TeamRequestsPage;

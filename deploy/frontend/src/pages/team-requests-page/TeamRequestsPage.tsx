import { LeaveRequestStatus, LeaveRequestWithEmployee } from '@/api/leave-request/leaveRequest.types';
import StatusBadge from '@/components/controls/badge/StatusBadge';
import Table, { Column } from '@/components/controls/table/Table';
import PageLayout from '@/components/layout/PageLayout';
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
import { useDebounce } from 'use-debounce';
import Button from '@/components/controls/button/Button';
import Pagination from '@/components/controls/Pagination';
import PageSizeSelector from '@/components/controls/PageSizeSelector';

const TeamRequestsPage: React.FC = () => {
  const { page, pageSize, setPageSize, setPage } = usePagination();
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
    { label: 'Other', value: 'other' },
  ];

  const statusOptions: SelectOption[] = [
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Declined', value: 'declined' },
  ];

  const [search, setSearch] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<SelectOption | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<SelectOption | null>(null);

  const [debouncedSearch] = useDebounce(search, 1000);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedFilter, selectedStatus]);

  const fetchTeamLeaveRequests = async () => {
    setIsLoading(true);
    setHasError(false);

    const filters = [];
    if (debouncedSearch) {
      filters.push({ filterKey: 'employeeName', operator: 'contains', value: debouncedSearch });
    }
    if (selectedFilter) {
      filters.push({ filterKey: 'type', operator: 'equals', value: selectedFilter.value });
    }
    if (selectedStatus) {
      filters.push({ filterKey: 'status', operator: 'equals', value: selectedStatus.value });
    }

    const queryParams: QueryParams = {
      pagination: { page, pageSize: pageSize as typeof PAGE_SIZES[number] },
      sort: sort.by && sort.direction ? { by: sort.by, direction: sort.direction } : undefined,
      filters: filters.length > 0 ? filters : undefined,
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
  }, [page, pageSize, sort.by, sort.direction, debouncedSearch, selectedFilter, selectedStatus]);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedFilter(null);
    setSelectedStatus(null);
  };

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
          formatter: (value: string) => value.charAt(0).toUpperCase() + value.slice(1),
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
                  <StatusBadge status="approved" className="rounded-md">
                    <BadgeIconCheckCircle className="w-4 h-4" />
                  </StatusBadge>
                </div>
                <div
                  onClick={() => handleStatusUpdate(row.id, 'declined')}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <StatusBadge status="declined" className="rounded-md">
                    <BadgeIconXCircle className="w-4 h-4" />
                  </StatusBadge>
                </div>
              </div>
            );
          },
        },
      ];

  return (
    <PageLayout
      title="Team Requests"
      action={
        <div className="flex gap-3 items-center xl:w-2/3">
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
            <Button
              onClick={handleClearFilters}
              className="px-4 py-6 text-p2"
            >
              Clear filters
            </Button>
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
      <div className="flex justify-between items-center mt-4">
        <PageSizeSelector pageSize={pageSize} onChange={setPageSize} />
        <Pagination totalPages={totalPages} />
      </div>
    </PageLayout>
  );
};

export default TeamRequestsPage;

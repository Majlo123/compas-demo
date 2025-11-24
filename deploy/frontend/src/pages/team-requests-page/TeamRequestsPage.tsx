import { LeaveRequestStatus } from '@/api/leave-request/leaveRequest.types';
import StatusBadge from '@/components/controls/badge/StatusBadge';
import Table, { Column } from '@/components/controls/table/Table';
import RequestsLayout from '@/components/layout/RequestsLayout';
import React, { useState } from 'react';
import Select from '@/components/controls/Select';
import { SelectOption } from '@/components/controls/Select';
import BadgeIconCheckCircle from '@/components/images/BadgeIconCheckCircle';
import BadgeIconXCircle from '@/components/images/BadgeIconXCircle';

const TeamRequestsPage: React.FC = () => {

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

    const columns: Column[] = [
        {
          accessor: 'employeeName',
          header: 'Employee name',
        },
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
        {
          accessor: 'actions',
          header: 'Actions',
          formatter: () => (
            <div className="flex gap-2 items-center justify-center">
              <StatusBadge status="approved" className="cursor-pointer hover:opacity-80 transition-opacity">
                <BadgeIconCheckCircle className="w-4 h-4 mr-1" />
              </StatusBadge>
              <StatusBadge status="declined" className="cursor-pointer hover:opacity-80 transition-opacity">
                <BadgeIconXCircle className="w-4 h-4 mr-1" />
              </StatusBadge>
            </div>
          ),
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
        isLoading={false}
        hasError={false}
        // change to true is empty state
        isEmpty={false}
    >
      <Table
        columns={columns}
        data={[]}
        tableClassName="text-sm lg:text-md"
        headerClassName="text-sm lg:text-md font-bold"
        cellClassName="text-sm lg:text-md"
      />
    </RequestsLayout>
  );
};

export default TeamRequestsPage;

import { LeaveRequestStatus } from '@/api/leave-request/leaveRequest.types';
import StatusBadge from '@/components/controls/badge/StatusBadge';
import Table, { Column } from '@/components/controls/table/Table';
import RequestsLayout from '@/components/layout/RequestsLayout';
import React, { useState } from 'react';
import Select from '@/components/controls/Select';
import { SelectOption } from '@/components/controls/Select';

const TeamRequestsPage: React.FC = () => {

  // Filter & sort state
  const filterOptions: SelectOption[] = [
    { label: 'Vacation', value: 'vacation' },
    { label: 'Sick Leave', value: 'sick' },
    { label: 'Personal Leave', value: 'personal' },
    { label: 'Unpaid', value: 'other' },
  ];

  const dateOptions: SelectOption[] = [
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
    { label: 'Upcoming', value: 'upcoming' },
  ];

  const typeOptions: SelectOption[] = [
    { label: 'Vacation', value: 'vacation' },
    { label: 'Sick Leave', value: 'sick' },
    { label: 'Personal Leave', value: 'personal' },
    { label: 'Unpaid', value: 'other' },
  ];

  const [selectedFilter, setSelectedFilter] = useState<SelectOption | null>(null);
  const [selectedDate, setSelectedDate] = useState<SelectOption | null>(null);
  const [selectedType, setSelectedType] = useState<SelectOption | null>(null);

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
          formatter: (value: LeaveRequestStatus) => (
            <StatusBadge status={value}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </StatusBadge>
          ),
        },
      ];

  return (
    <RequestsLayout
      title="Team Requests"
      action={
        <div className="flex gap-3 items-center">
            <Select className="text-p1" placeholder="Filter by:" options={filterOptions} value={selectedFilter} onChange={setSelectedFilter} />
            <Select className="text-p1" placeholder="Date" options={dateOptions} value={selectedDate} onChange={setSelectedDate} />
            <Select className="text-p1" placeholder="Leave Type" options={typeOptions} value={selectedType} onChange={setSelectedType} />
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

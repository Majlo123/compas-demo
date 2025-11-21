import { Column } from '@/components/controls/table/Table';
import StatusBadge from '@/components/controls/badge/StatusBadge';
import { LeaveRequestStatus } from '@/api/leave-request/leaveRequest.types';

export const getRequestColumns = (): Column[] => [
  { accessor: 'type', header: 'Type' },
  { accessor: 'startDate', header: 'Start Date' },
  { accessor: 'endDate', header: 'End Date' },
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

import React, { useState } from 'react';
import Button from '@/components/controls/button/Button';
import Table, { Column, Row } from '@/components/controls/table/Table';
import StatusBadge from '@/components/controls/badge/StatusBadge';
import CustomDialog from '@/components/dialog/dialog-props';
import Select, { SelectOption } from '@/components/controls/Select';
import DateInput from '@/components/controls/DateInput';

type LeaveRequestStatus = 'approved' | 'pending' | 'declined';

interface LeaveRequest extends Row {
  type: string;
  startDate: string;
  endDate: string;
  status: LeaveRequestStatus;
}

const MyLeaveRequestsPage: React.FC = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<SelectOption | null>(null);

  const handleNewRequest = () => {
    setDialogOpen(true);
  };
  
  // Sample data
  const leaveRequests: LeaveRequest[] = [ 
    {
      _id: '1',
      type: 'Vacation',
      startDate: 'Aug 12, 2024',
      endDate: 'Aug 16, 2024',
      status: 'approved',
    },
    {
      _id: '2',
      type: 'Sick',
      startDate: 'Sep 23, 2024',
      endDate: 'Sep 24, 2024',
      status: 'pending',
    },
    {
      _id: '3',
      type: 'Vacation',
      startDate: 'Oct 17, 2024',
      endDate: 'Oct 18, 2024',
      status: 'declined',
    },
    {
      _id: '4',
      type: 'Vacation',
      startDate: 'Nov 28, 2024',
      endDate: 'Dec 2, 2024',
      status: 'approved',
    },
    {
      _id: '5',
      type: 'Sick',
      startDate: 'Dec 2, 2024',
      endDate: 'Dec 10, 2024',
      status: 'declined',
    },
    {
      _id: '5',
      type: 'Sick',
      startDate: 'Dec 2, 2024',
      endDate: 'Dec 10, 2024',
      status: 'declined',
    },
    {
      _id: '5',
      type: 'Sick',
      startDate: 'Dec 2, 2024',
      endDate: 'Dec 10, 2024',
      status: 'declined',
    },
    {
      _id: '5',
      type: 'Sick',
      startDate: 'Dec 2, 2024',
      endDate: 'Dec 10, 2024',
      status: 'declined',
    },
  ];

  const columns: Column[] = [
    {
      accessor: 'type',
      header: 'Type',
      width: '25%',
    },
    {
      accessor: 'startDate',
      header: 'Start Date',
      width: '25%',
    },
    {
      accessor: 'endDate',
      header: 'End Date',
      width: '25%',
    },
    {
      accessor: 'status',
      header: 'Status',
      width: '25%',
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
        <h1 className="text-3xl font-extrabold text-gray-800">My Leave Requests</h1>
        <Button onClick={handleNewRequest} className="text-lg font-medium">
          + New Leave Request
        </Button>
      </div>

      {/* Content Area */}
      <div>
        <Table
          columns={columns}
          data={leaveRequests}
          tableClassName="text-sm lg:text-lg"
          headerClassName="text-sm lg:text-xl font-bold"
          cellClassName="text-sm lg:text-xl"
          rowHeight={64}
          headerHeight={56}
        />
      </div>

      {/* Dialog */}
      <CustomDialog
        title="New Leave Request"
        description="Fill out the form to create a new leave request."
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
      >
        <form>
          <div className="mb-4">
            <Select
              options={[
                { label: 'Vacation', value: 'Vacation' },
                { label: 'Sick Leave', value: 'Sick Leave' },
                { label: 'Personal Leave', value: 'Personal Leave' },
                { label: 'Unpaid Leave', value: 'Unpaid Leave' },
              ]}
              label='Leave Type'
              value={selectedLeaveType}
              placeholder="Select Leave Type"
              onChange={(selectedOption: SelectOption | null) => setSelectedLeaveType(selectedOption)}
            />
          </div>
          <div className="mb-4">
            <DateInput
              label="Start Date"
              required
              className="mb-4"
            />
          </div>
          <div className="mb-4">
            <DateInput
              label="End Date"
              required
              className="mb-4"
            />
          </div>
          <div className="flex justify-end">
            <Button type='submit' className="w-full">Submit</Button>
          </div>
        </form>
      </CustomDialog>
    </>
  );
};

export default MyLeaveRequestsPage;

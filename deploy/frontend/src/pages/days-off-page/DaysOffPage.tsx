import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/controls/button/Button';
import Table, { Column, Row } from '@/components/controls/table/Table';
import PageLayout from '@/components/layout/PageLayout';
import ConfirmDialog from '@/components/dialog/ConfirmDialog';
import DialogDayOffForm from '@/components/dialog/DialogDayOffForm';

interface DayOffRow extends Row {
  id: string;
  date: string;
  title: string;
}

const DaysOffPage: React.FC = () => {
  const [daysOff, setDaysOff] = useState<DayOffRow[]>([
    {
      _id: '1',
      id: '1',
      date: '2025-12-25',
      title: 'Christmas Day',
    },
    {
      _id: '2',
      id: '2',
      date: '2025-12-26',
      title: 'Boxing Day',
    },
    {
      _id: '3',
      id: '3',
      date: '2026-01-01',
      title: 'New Year\'s Day',
    },
    {
      _id: '4',
      id: '4',
      date: '2026-04-10',
      title: 'Good Friday',
    },
    {
      _id: '5',
      id: '5',
      date: '2026-05-25',
      title: 'Spring Bank Holiday',
    },
  ]);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [dayOffToDelete, setDayOffToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isAdmin] = useState(true); // Mock admin status

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleAddDayOff = () => {
    setAddDialogOpen(true);
  };

  const handleAddDayOffSubmit = (data: { date: string; title: string }) => {
    const newDayOff: DayOffRow = {
      _id: Math.random().toString(),
      id: Math.random().toString(),
      date: data.date,
      title: data.title,
    };

    setDaysOff([...daysOff, newDayOff].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    toast.success('Day off added successfully');
  };

  const handleDeleteDayOff = (dayOffId: string, dayOffTitle: string) => {
    setDayOffToDelete({ id: dayOffId, title: dayOffTitle });
    setConfirmDialogOpen(true);
  };

  const confirmDeleteDayOff = () => {
    if (!dayOffToDelete) return;

    setDaysOff(daysOff.filter(d => d.id !== dayOffToDelete.id));
    toast.success(`Day off "${dayOffToDelete.title}" deleted successfully`);
    setDayOffToDelete(null);
  };

  const columns: Column[] = [
    {
      accessor: 'date',
      header: 'Date',
      formatter: (value: string) => formatDate(value),
    },
    {
      accessor: 'title',
      header: 'Title/Description',
    },
    ...(isAdmin ? [
      {
        accessor: 'actions',
        header: 'Actions',
        formatter: (_value: any, row: DayOffRow) => (
          <div className="flex gap-2 items-center justify-center">
            <Button
              variant="delete"
              size="sm"
              onClick={() => handleDeleteDayOff(row.id, row.title)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ] : []),
  ];

  return (
    <>
      <PageLayout
        title="Global Days Off"
        description="Manage organization-wide days off and holidays"
        action={
          isAdmin && (
            <Button onClick={handleAddDayOff} className="text-lg font-medium">
              + Add Day Off
            </Button>
          )
        }
        actionPosition="inline"
        emptyMessage="No days off configured"
        emptyDescription="Add global days off to manage organization holidays"
        isEmpty={daysOff.length === 0}
        isLoading={false}
        hasError={false}
      >
        <Table
          columns={columns}
          data={daysOff}
          tableClassName="text-p2 lg:text-p1"
          headerClassName="text-p2 lg:text-p1 font-bold"
          cellClassName="text-p2 lg:text-p1"
        />
      </PageLayout>

      <ConfirmDialog
        isOpen={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title="Delete Day Off"
        message={`Are you sure you want to delete "${dayOffToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDeleteDayOff}
      />

      <DialogDayOffForm
        isOpen={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddDayOffSubmit}
      />
    </>
  );
};

export default DaysOffPage;

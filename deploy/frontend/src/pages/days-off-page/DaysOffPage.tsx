import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/controls/button/Button';
import Table, { Column, Row } from '@/components/controls/table/Table';
import PageLayout from '@/components/layout/PageLayout';
import ConfirmDialog from '@/components/dialog/ConfirmDialog';
import DialogDayOffForm from '@/components/dialog/DialogDayOffForm';
import { useAuthStore } from '@/stores/useAuthStore';
import { isApiSuccess } from '@/api/shared.types';
import {
  getAllCollectiveDaysOff,
  createCollectiveDayOff,
  deleteCollectiveDayOff,
} from '@/api/collective-day-off/collectiveDayOff.actions';
import { CollectiveDayOff } from '../../../../shared/collectiveDayOff.types';

interface DayOffRow extends Row {
  id: string;
  startDate: string;
  endDate: string;
  title: string;
}

const DaysOffPage: React.FC = () => {
  const [daysOff, setDaysOff] = useState<DayOffRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [dayOffToDelete, setDayOffToDelete] = useState<{ id: string; title: string } | null>(null);
  
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchDaysOff();
  }, []);

  const fetchDaysOff = async () => {
    setIsLoading(true);
    setHasError(false);
    
    const response = await getAllCollectiveDaysOff();
    
    if (isApiSuccess(response)) {
      const mappedData: DayOffRow[] = response.content.map((day: CollectiveDayOff) => ({
        _id: day.id,
        id: day.id,
        startDate: day.startDate,
        endDate: day.endDate,
        title: day.description,
      }));
      setDaysOff(mappedData);
    } else {
      setHasError(true);
      toast.error(response.error?.message || 'Failed to load days off');
    }
    
    setIsLoading(false);
  };

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

  const handleAddDayOffSubmit = async (data: { startDate: string; endDate: string; title: string }) => {
    const response = await createCollectiveDayOff({
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.title,
    });

    if (isApiSuccess(response)) {
      toast.success('Day off added successfully');
      setAddDialogOpen(false);
      await fetchDaysOff();
    } else {
      toast.error(response.error?.message || 'Failed to add day off');
    }
  };

  const handleDeleteDayOff = (dayOffId: string, dayOffTitle: string) => {
    setDayOffToDelete({ id: dayOffId, title: dayOffTitle });
    setConfirmDialogOpen(true);
  };

  const confirmDeleteDayOff = async () => {
    if (!dayOffToDelete) return;

    const response = await deleteCollectiveDayOff(dayOffToDelete.id);

    if (isApiSuccess(response)) {
      toast.success(`Day off "${dayOffToDelete.title}" deleted successfully`);
      setConfirmDialogOpen(false);
      setDayOffToDelete(null);
      await fetchDaysOff();
    } else {
      toast.error(response.error?.message || 'Failed to delete day off');
    }
  };

  const columns: Column[] = [
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
        isLoading={isLoading}
        hasError={hasError}
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

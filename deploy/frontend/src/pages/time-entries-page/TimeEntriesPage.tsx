import { FC, useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import WeeklyCalendar from '@/components/calendar/WeeklyCalendar';
import ConfirmDialog from '@/components/dialog/ConfirmDialog';
import { getAllCollectiveDaysOff } from '@/api/collective-day-off/collectiveDayOff.actions';
import { getTimeEntries, createTimeEntry, updateTimeEntry, deleteTimeEntry } from '@/api/time-entry/timeEntry.actions';
import { getTeamsByUserId } from '@/api/team/team.actions';
import { isApiSuccess } from '@/api/shared.types';
import { useAuthStore } from '@/stores/useAuthStore';
import { CollectiveDayOff } from '../../../../shared/collectiveDayOff.types';
import { TimeEntry as TimeEntryType, TimeEntryUI } from '../../../../shared/timeEntry.types';

const TimeEntriesPage: FC = () => {
  const [entries, setEntries] = useState<TimeEntryUI[]>([]);
  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([]);
  const [collectiveDaysOff, setCollectiveDaysOff] = useState<CollectiveDayOff[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; entryId: string | null }>({
    isOpen: false,
    entryId: null
  });
  const { user } = useAuthStore();

  // Fetch time entries for the current week
  const fetchTimeEntries = async (weekStart: Date) => {
    setLoading(true);
    setError(null);

    try {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      const startDateStr = format(weekStart, 'yyyy-MM-dd');
      const endDateStr = format(weekEnd, 'yyyy-MM-dd');

      const response = await getTimeEntries(startDateStr, endDateStr);

      if (isApiSuccess(response)) {
        // Transform backend data to calendar format
        const transformedEntries: TimeEntryUI[] = response.content
          .filter((entry: TimeEntryType) => {
            // Skip entries with invalid times
            const startTime = new Date(entry.startTime);
            const endTime = new Date(entry.endTime);
            return !isNaN(startTime.getTime()) && !isNaN(endTime.getTime());
          })
          .map((entry: TimeEntryType) => {
            const startTime = new Date(entry.startTime);
            const endTime = new Date(entry.endTime);
            
            return {
              id: entry.id,
              title: entry.description || 'No description',
              start: startTime.toISOString(),
              end: endTime.toISOString(),
              projectName: entry.projectName,
              color: '#3b82f6',
              createdAt: entry.createdAt || startTime.toISOString(),
              isOvertime: entry.isOvertime,
              isBillable: entry.isBillable,
              timeSpentMinutes: Math.round((endTime.getTime() - startTime.getTime()) / 60000)
            };
          });

        setEntries(transformedEntries);
      } else {
        setError(response.error.message || 'Failed to fetch time entries');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error fetching time entries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCollectiveDaysOff = async () => {
      const response = await getAllCollectiveDaysOff();
      if (isApiSuccess(response)) {
        setCollectiveDaysOff(response.content);
      }
    };
    fetchCollectiveDaysOff();
  }, []);

  useEffect(() => {
    const fetchProjectsFromTeams = async () => {
      if (!user?.id) return;
      const response = await getTeamsByUserId(user.id);
      if (isApiSuccess(response)) {
        const teams = response.content?.data ?? [];
        const mapped = teams.map((team) => ({ id: team.id, name: team.name }));
        setProjects(mapped);
      }
    };

    fetchProjectsFromTeams();
  }, [user?.id]);

  useEffect(() => {
    fetchTimeEntries(currentWeekStart);
  }, [currentWeekStart]);

  const handleNavigate = (weekStart: Date) => {
    setCurrentWeekStart(weekStart);
  };

  const handleAddTimeEntry = async (data: any, date: Date, clickedTime?: { hour: number; minute: number }) => {
    const projectName = data.project || data.projectName;
    
    // Use clicked time if provided, otherwise use the time from the dialog
    const startHour = clickedTime?.hour ?? data.startHour ?? 8;
    const startMinute = clickedTime?.minute ?? data.startMinute ?? 0;
    
    // Create start time using UTC to avoid timezone issues
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const startTime = new Date(Date.UTC(year, month, day, startHour, startMinute, 0, 0));
    
    // Calculate end time based on hours and minutes
    const totalMinutes = data.hours * 60 + data.minutes;
    const endTime = new Date(startTime.getTime() + totalMinutes * 60000);

    const response = await createTimeEntry({
      projectName,
      description: data.description,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      isOvertime: data.overtime,
      isBillable: data.billable
    });

    if (isApiSuccess(response)) {
      // Refresh entries
      await fetchTimeEntries(currentWeekStart);
    } else {
      setError(response.error.message || 'Failed to create time entry');
    }
  };

  const handleEditTimeEntry = async (id: string, data: any, date: Date) => {
    const projectName = data.project || data.projectName;
    
    // Create start time using UTC to avoid timezone issues
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const startTime = new Date(Date.UTC(year, month, day, data.startHour ?? 8, data.startMinute ?? 0, 0, 0));
    
    // Calculate end time
    const totalMinutes = data.hours * 60 + data.minutes;
    const endTime = new Date(startTime.getTime() + totalMinutes * 60000);

    const response = await updateTimeEntry(id, {
      projectName,
      description: data.description,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      isOvertime: data.overtime,
      isBillable: data.billable
    });

    if (isApiSuccess(response)) {
      // Refresh entries
      await fetchTimeEntries(currentWeekStart);
    } else {
      setError(response.error.message || 'Failed to update time entry');
    }
  };

  const handleDeleteTimeEntry = (id: string) => {
    setDeleteConfirm({ isOpen: true, entryId: id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.entryId) return;

    const response = await deleteTimeEntry(deleteConfirm.entryId);

    if (isApiSuccess(response)) {
      // Immediately remove from UI
      setEntries(prev => prev.filter(e => e.id !== deleteConfirm.entryId));
      setDeleteConfirm({ isOpen: false, entryId: null });
    } else {
      setError('Failed to delete time entry');
      setDeleteConfirm({ isOpen: false, entryId: null });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ isOpen: false, entryId: null });
  };

  return (
    <div className="time-entries-page h-full flex flex-col p-0 bg-grey95 overflow-y-auto">
      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-md m-md rounded flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="bg-transparent border-0 text-red-700 cursor-pointer text-xl px-2 hover:bg-red-200 rounded transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="bg-sky-100 text-sky-700 p-md m-md rounded text-center">
          Loading time entries...
        </div>
      )}

      <div className="relative flex-1 h-auto bg-white rounded-none border-0 overflow-visible">
        <WeeklyCalendar
          entries={entries}
          onNavigate={handleNavigate}
          collectiveDaysOff={collectiveDaysOff}
          projects={projects}
          onAddTimeEntry={handleAddTimeEntry}
          onEditTimeEntry={handleEditTimeEntry}
          onDeleteTimeEntry={handleDeleteTimeEntry}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onOpenChange={(isOpen) => !isOpen && cancelDelete()}
        title="Delete Time Entry"
        message="Are you sure you want to delete this time entry? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        variant="danger"
      />
    </div>
  );
};

export default TimeEntriesPage;

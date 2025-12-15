import React, { FC, useState, useEffect } from 'react';
import WeeklyCalendar from '@/components/calendar/WeeklyCalendar';
import { getAllCollectiveDaysOff } from '@/api/collective-day-off/collectiveDayOff.actions';
import { isApiSuccess } from '@/api/shared.types';
import { CollectiveDayOff } from '../../../../shared/collectiveDayOff.types';

type TimeEntry = {
  id: string;
  title: string;
  start: string | Date;
  end: string | Date;
  teamName?: string;
  projectName?: string;
  color?: string;
  createdAt?: string | Date;
};

const TimeEntriesPage: FC = () => {
  const [entries] = useState<TimeEntry[]>([]);
  const [collectiveDaysOff, setCollectiveDaysOff] = useState<CollectiveDayOff[]>([]);

  // Mock projects data
  const mockProjects = [
    { id: '1', name: 'Website Redesign' },
    { id: '2', name: 'Mobile App Development' },
    { id: '3', name: 'Backend API' },
    { id: '4', name: 'Database Optimization' },
    { id: '5', name: 'Testing & QA' },
  ];

  useEffect(() => {
    const fetchCollectiveDaysOff = async () => {
      const response = await getAllCollectiveDaysOff();
      if (isApiSuccess(response)) {
        setCollectiveDaysOff(response.content);
      }
    };
    fetchCollectiveDaysOff();
  }, []);

  const handleSelectEntry = (entry: TimeEntry) => {
    console.log('Selected entry:', entry);
  };

  const handleNavigate = (weekStart: Date) => {
    console.log('Week changed:', weekStart);
  };

  return (
    <div className="time-entries-page" style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      backgroundColor: '#f5f5f5',
      overflowY: 'auto' // Allow page scrolling
    }}>
      <div style={{
        position: 'relative',
        flex: '1 0 auto', // Allow growth
        height: 'auto',   // Natural height
        backgroundColor: '#ffffff',
        borderRadius: '0',
        border: 'none',
        overflow: 'visible' // No clipping
      }}>
        <WeeklyCalendar
          entries={entries}
          onSelectEntry={handleSelectEntry}
          onNavigate={handleNavigate}
          collectiveDaysOff={collectiveDaysOff}
          projects={mockProjects}
        />
      </div>
    </div>
  );
};

export default TimeEntriesPage;

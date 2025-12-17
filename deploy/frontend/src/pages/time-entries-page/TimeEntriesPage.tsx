import React, { FC, useState, useEffect } from 'react';
import WeeklyCalendar from '@/components/calendar/WeeklyCalendar';
import { getAllCollectiveDaysOff } from '@/api/collective-day-off/collectiveDayOff.actions';
import { isApiSuccess } from '@/api/shared.types';
import { CollectiveDayOff } from '@shared/collectiveDayOff.types';
import { TimeEntry } from '@shared/timeEntry.types';

const TimeEntriesPage: FC = () => {
  const [entries] = useState<TimeEntry[]>([]);
  const [collectiveDaysOff, setCollectiveDaysOff] = useState<CollectiveDayOff[]>([]);

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
    <div className="time-entries-page h-full flex flex-col p-0 bg-layoutBg overflow-y-auto">
      <div className="relative flex-1 h-auto bg-white rounded-none border-none overflow-visible">
        <WeeklyCalendar
          entries={entries}
          onSelectEntry={handleSelectEntry}
          onNavigate={handleNavigate}
          collectiveDaysOff={collectiveDaysOff}
        />
      </div>
    </div>
  );
};

export default TimeEntriesPage;

import React, { FC, useState, useMemo } from 'react';
import { format, startOfWeek, addDays, addWeeks, subWeeks, parseISO, differenceInMinutes } from 'date-fns';
import AddTimeEntryDialog from '@/components/dialog/AddTimeEntryDialog';
import './weekly-calendar.css';

type TimeEntry = {
  id: string;
  title: string;
  start: string | Date;
  end: string | Date;
  teamName?: string;
  projectName?: string;
  color?: string;
  createdAt?: string | Date;
  [key: string]: any;
};

type CollectiveDayOff = {
  id: string;
  startDate: string;
  endDate: string;
  description: string;
  createdAt?: string;
};

type Props = {
  entries: TimeEntry[];
  onSelectEntry?: (entry: TimeEntry) => void;
  onNavigate?: (weekStart: Date) => void;
  style?: React.CSSProperties;
  collectiveDaysOff?: CollectiveDayOff[];
  projects?: Array<{ id: string; name: string }>;
  onAddTimeEntry?: (data: any, date: Date) => void;
};

const WeeklyCalendar: FC<Props> = ({ entries, onSelectEntry, onNavigate, style, collectiveDaysOff = [], projects = [], onAddTimeEntry }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }) // Monday
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const weekDays = useMemo(() => {
    // Monday to Friday only
    return Array.from({ length: 5 }, (_, i) => addDays(currentWeekStart, i));
  }, [currentWeekStart]);

  const handlePrevWeek = () => {
    const newWeekStart = subWeeks(currentWeekStart, 1);
    setCurrentWeekStart(newWeekStart);
    onNavigate?.(newWeekStart);
  };

  const handleNextWeek = () => {
    const newWeekStart = addWeeks(currentWeekStart, 1);
    setCurrentWeekStart(newWeekStart);
    onNavigate?.(newWeekStart);
  };

  const handleToday = () => {
    const newWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    setCurrentWeekStart(newWeekStart);
    onNavigate?.(newWeekStart);
  };

  // Group entries by day
  const entriesByDay = useMemo(() => {
    const grouped: { [key: string]: TimeEntry[] } = {};

    weekDays.forEach(day => {
      const dayKey = format(day, 'yyyy-MM-dd');
      grouped[dayKey] = [];
    });

    entries.forEach(entry => {
      const entryDate = typeof entry.start === 'string' ? parseISO(entry.start) : entry.start;
      const dayKey = format(entryDate, 'yyyy-MM-dd');

      if (grouped[dayKey]) {
        grouped[dayKey].push(entry);
      }
    });

    // Sort entries by creation time (or start time if createdAt not available)
    Object.keys(grouped).forEach(dayKey => {
      grouped[dayKey].sort((a, b) => {
        const aTime = a.createdAt
          ? (typeof a.createdAt === 'string' ? new Date(a.createdAt) : a.createdAt).getTime()
          : (typeof a.start === 'string' ? new Date(a.start) : a.start).getTime();
        const bTime = b.createdAt
          ? (typeof b.createdAt === 'string' ? new Date(b.createdAt) : b.createdAt).getTime()
          : (typeof b.start === 'string' ? new Date(b.start) : b.start).getTime();
        return aTime - bTime;
      });
    });

    return grouped;
  }, [entries, weekDays]);

  // Calculate total hours per day
  const dailyTotals = useMemo(() => {
    const totals: { [key: string]: number } = {};

    Object.entries(entriesByDay).forEach(([dayKey, dayEntries]) => {
      const totalMinutes = dayEntries.reduce((sum, entry) => {
        const start = typeof entry.start === 'string' ? parseISO(entry.start) : entry.start;
        const end = typeof entry.end === 'string' ? parseISO(entry.end) : entry.end;
        return sum + differenceInMinutes(end, start);
      }, 0);
      totals[dayKey] = totalMinutes / 60; // Convert to hours
    });

    return totals;
  }, [entriesByDay]);

  const formatDuration = (start: string | Date, end: string | Date) => {
    const startDate = typeof start === 'string' ? parseISO(start) : start;
    const endDate = typeof end === 'string' ? parseISO(end) : end;
    const minutes = differenceInMinutes(endDate, startDate);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:00`;
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setIsDialogOpen(true);
  };

  const handleDialogSubmit = (data: any, date: Date) => {
    onAddTimeEntry?.(data, date);
    setIsDialogOpen(false);
  };

  const handleDialogCancel = () => {
    setIsDialogOpen(false);
  };

  const getDayOffInfo = (date: Date) => {
    // 1. Reset time to midnight for accurate comparison
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    // Helper to parse "YYYY-MM-DD" as local midnight date
    const parseLocalYMD = (dateStr: string) => {
      const [y, m, d] = dateStr.split('-').map(Number);
      return new Date(y, m - 1, d);
    };

    // 2. Find the matching day off
    const matchingDayOff = collectiveDaysOff.find(dayOff => {
      const start = parseLocalYMD(dayOff.startDate);
      const end = parseLocalYMD(dayOff.endDate);
      return checkDate >= start && checkDate <= end;
    });

    return matchingDayOff;
  };

  return (
    <div className="weekly-calendar" style={style}>
      {/* Toolbar */}
      <div className="weekly-toolbar">
        <div className="weekly-nav">
          <button onClick={handlePrevWeek} className="nav-btn" title="Previous Week">
            ←
          </button>
          <button onClick={handleNextWeek} className="nav-btn" title="Next Week">
            →
          </button>
        </div>
        <div className="weekly-title" style={{ flex: 1, textAlign: 'center' }}>
          Time Entries
        </div>
        <div style={{ width: '104px' }}></div>
      </div>

      {/* Calendar Grid */}
      <div className="weekly-grid">
        {/* Time labels column */}
        <div className="time-column">
          <div className="time-header"></div>
          {Array.from({ length: 12 }, (_, i) => 7 + i).map(hour => (
            <div key={hour} className="time-label">
              {String(hour).padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {/* Day columns */}
        {weekDays.map((day) => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const dayEntries = entriesByDay[dayKey] || [];
          const total = dailyTotals[dayKey] || 0;

          const dayOff = getDayOffInfo(day);
          const isDayOff = !!dayOff;

          let dayStyle: React.CSSProperties = {};
          let dayClass = 'day-column';

          if (isDayOff && dayOff) {
            dayClass += ' collective-day-off';
            const safeDesc = dayOff.description
              .replace(/\\/g, "\\\\")
              .replace(/"/g, "'")
              .replace(/\n/g, " ");

            dayStyle = {
              // @ts-ignore
              '--collective-tooltip-text': `"${safeDesc}"`
            };
          }

          return (
            <div
              key={dayKey}
              className={dayClass}
              style={dayStyle}
              onClick={() => handleDayClick(day)}
              role="button"
              tabIndex={0}
            >
              {/* Day header */}
              <div className="day-header">
                <span className="day-name">{format(day, 'EEE, MMM d')}</span>
                <span className="day-time" style={{ marginLeft: '8px' }}>{format(day, 'HH:mm:ss')}</span>
              </div>

              {/* Time grid */}
              <div className="time-grid">
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} className="time-slot"></div>
                ))}

                {/* Entries */}
                <div className="entries-container">
                  {dayEntries.map(entry => (
                    <div
                      key={entry.id}
                      className="time-entry"
                      style={{
                        borderLeftColor: entry.color || '#ff4d4f',
                        cursor: onSelectEntry ? 'pointer' : 'default'
                      }}
                      onClick={() => onSelectEntry?.(entry)}
                    >
                      <div className="entry-content">
                        <div className="entry-title">{entry.title}</div>
                        {(entry.teamName || entry.projectName) && (
                          <div className="entry-team">
                            {entry.teamName && <span className="team-name">{entry.teamName}</span>}
                            {entry.teamName && entry.projectName && <span> : </span>}
                            {entry.projectName && <span>{entry.projectName}</span>}
                          </div>
                        )}
                      </div>
                      <div className="entry-footer">
                        <span className="entry-icons">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 7h10v10H7z" />
                          </svg>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2v20M2 12h20" />
                          </svg>
                        </span>
                        <span className="entry-duration">
                          {formatDuration(entry.start, entry.end)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily total */}
              {total > 0 && (
                <div className="day-total">
                  Total: {total.toFixed(2)}h
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Time Entry Dialog */}
      <AddTimeEntryDialog
        isOpen={isDialogOpen}
        selectedDate={selectedDate}
        projects={projects}
        onSubmit={handleDialogSubmit}
        onCancel={handleDialogCancel}
      />
    </div>
  );
};

export default React.memo(WeeklyCalendar);

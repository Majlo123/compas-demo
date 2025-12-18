import React, { FC, useState, useMemo } from 'react';
import { format, startOfWeek, addDays, addWeeks, subWeeks, parseISO, differenceInMinutes } from 'date-fns';
import AddTimeEntryDialog, { TimeEntryInitialData } from '@/components/dialog/AddTimeEntryDialog';
import { CollectiveDayOff } from '@/shared/collectiveDayOff.types';
import { TimeEntryUI } from '@/shared/timeEntry.types';
import './weekly-calendar.css';

type Props = {
  entries: TimeEntryUI[];
  onSelectEntry?: (entry: TimeEntryUI) => void;
  onNavigate?: (weekStart: Date) => void;
  style?: React.CSSProperties;
  collectiveDaysOff?: CollectiveDayOff[];
  projects?: Array<{ id: string; name: string }>;
  onAddTimeEntry?: (data: any, date: Date) => void;
  onEditTimeEntry?: (id: string, data: any, date: Date) => void;
  onDeleteTimeEntry?: (id: string) => void;
};

const WeeklyCalendar: FC<Props> = ({
  entries,
  onSelectEntry,
  onNavigate,
  style,
  collectiveDaysOff = [],
  projects = [],
  onAddTimeEntry,
  onEditTimeEntry,
  onDeleteTimeEntry
}) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }) // Monday
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [editingEntry, setEditingEntry] = useState<TimeEntryInitialData | undefined>();
  const [selectedTime, setSelectedTime] = useState<{ hour: number; minute: number } | undefined>();

  const weekDays = useMemo(() => {
    // Monday to Friday only
    return Array.from({ length: 5 }, (_, i) => addDays(currentWeekStart, i));
  }, [currentWeekStart]);

  // Calculate dynamic time range based on entries
  const timeRange = useMemo(() => {
    const startHour = 7;
    let endHour = 18;

    // Find the maximum end time from all entries
    entries.forEach(entry => {
      const endDate = typeof entry.end === 'string' ? parseISO(entry.end) : entry.end;
      if (endDate && !isNaN(endDate.getTime())) {
        const entryEndHour = endDate.getUTCHours();
        const entryEndMinutes = endDate.getUTCMinutes();

        // Always include one extra hour to show the final boundary label
        // This makes the last visible label match the actual end time (e.g., 13:00)
        const requiredEndHour = (entryEndMinutes > 0 ? entryEndHour + 1 : entryEndHour) + 1;

        if (requiredEndHour > endHour) {
          endHour = requiredEndHour;
        }
      }
    });

    // Ensure minimum range of 7:00 to 18:00, plus one extra hour for the end boundary label
    endHour = Math.max(endHour, 19);

    const hours = endHour - startHour;

    return { startHour, endHour, hours };
  }, [entries]);

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
        const getValidTime = (dateValue: string | Date | undefined, fallback: string | Date): number => {
          if (!dateValue) return new Date(fallback).getTime();
          const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
          return isNaN(date.getTime()) ? new Date(fallback).getTime() : date.getTime();
        };

        const aTime = getValidTime(a.createdAt, a.start);
        const bTime = getValidTime(b.createdAt, b.start);
        return bTime - aTime;
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

  // Helper for robust UTC duration calculation
  // Helper for robust UTC duration calculation
  const getUtcDurationMinutes = (start: string | Date, end: string | Date) => {
    const s = typeof start === 'string' ? parseISO(start) : start;
    const e = typeof end === 'string' ? parseISO(end) : end;
    // getTime() returns UTC timestamp
    return (e.getTime() - s.getTime()) / 60000;
  };

  const formatDuration = (start: string | Date, end: string | Date) => {
    const minutes = getUtcDurationMinutes(start, end);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:00`;
  };

  // Format a time range using UTC to avoid local timezone offsets
  const formatUtcTimeRange = (start: string | Date, end: string | Date) => {
    const s = typeof start === 'string' ? parseISO(start) : start;
    const e = typeof end === 'string' ? parseISO(end) : end;
    const sh = String(s.getUTCHours()).padStart(2, '0');
    const sm = String(s.getUTCMinutes()).padStart(2, '0');
    const eh = String(e.getUTCHours()).padStart(2, '0');
    const em = String(e.getUTCMinutes()).padStart(2, '0');
    return `${sh}:${sm}-${eh}:${em}`;
  };

  const handleDayClick = (day: Date, hour?: number) => {
    setSelectedDate(day);
    if (hour !== undefined) {
      setSelectedTime({ hour, minute: 0 });
    } else {
      setSelectedTime(undefined);
    }
    setDialogMode('create');
    setEditingEntry(undefined);
    setIsDialogOpen(true);
  };

  const handleEditEntry = (entry: TimeEntry, e: React.MouseEvent) => {
    e.stopPropagation();
    const entryStartDate = typeof entry.start === 'string' ? parseISO(entry.start) : entry.start;
    const entryEndDate = typeof entry.end === 'string' ? parseISO(entry.end) : entry.end;

    // Use UTC based duration
    const totalMinutes = entry.timeSpentMinutes || getUtcDurationMinutes(entryStartDate, entryEndDate);

    const projectId = projects.find(p => p.name === entry.projectName)?.id || entry.projectName || '';

    // Extract start time from the entry
    const startHour = entryStartDate.getUTCHours();
    const startMinute = entryStartDate.getUTCMinutes();

    setSelectedDate(entryStartDate);
    setEditingEntry({
      id: entry.id,
      project: projectId,
      description: entry.title || '',
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60,
      overtime: entry.isOvertime || false,
      billable: entry.isBillable || false,
      startHour,
      startMinute
    });
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleDeleteEntry = (entry: TimeEntry, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteTimeEntry?.(entry.id);
  };

  const handleDialogSubmit = (data: any, date: Date) => {
    if (dialogMode === 'edit' && editingEntry) {
      onEditTimeEntry?.(editingEntry.id, data, date);
    } else {
      onAddTimeEntry?.(data, date);
    }
    setIsDialogOpen(false);
    setEditingEntry(undefined);
  };

  const handleDialogCancel = () => {
    setIsDialogOpen(false);
    setIsDialogOpen(false);
    setEditingEntry(undefined);
    setSelectedTime(undefined);
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
          {Array.from({ length: timeRange.hours }, (_, i) => timeRange.startHour + i).map(hour => (
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
              // Remove onClick from parent to rely on specific slot clicks, or keep it as fallback?
              // keeping it but stopping propagation in children might be safer
              onClick={(e) => {
                // If the click originated from this div directly (empty space), maybe default to generic day click
                if (e.target === e.currentTarget) handleDayClick(day);
              }}
              role="button"
              tabIndex={0}
            >
              {/* Day header */}
              <div className="day-header">
                <span className="day-name">{format(day, 'EEE, MMM d')}</span>
                <span className="day-time" style={{ marginLeft: '8px' }}>
                  {(() => {
                    const totalHours = Math.floor(total);
                    const totalMinutes = Math.round((total - totalHours) * 60);
                    return `${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}:00`;
                  })()}
                </span>
              </div>

              {/* Time grid */}
              <div className="time-grid" style={{ position: 'relative' }}>
                {Array.from({ length: timeRange.hours }, (_, i) => {
                  const hour = timeRange.startHour + i;
                  return (
                    <div
                      key={i}
                      className="time-slot"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDayClick(day, hour);
                      }}
                      style={{ cursor: 'pointer' }}
                    ></div>
                  );
                })}

                {/* Entries */}
                <div className="entries-container" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', padding: 0 }}>
                  {dayEntries.map(entry => {
                    const entryStart = typeof entry.start === 'string' ? parseISO(entry.start) : entry.start;
                    const entryEnd = typeof entry.end === 'string' ? parseISO(entry.end) : entry.end;

                    const startHour = timeRange.startHour;
                    const pixelsPerHour = 60; // 60px height (1px = 1min)

                    const startMinutesFromTop = (entryStart.getUTCHours() - startHour) * 60 + entryStart.getUTCMinutes();

                    // Use UTC math for precise duration
                    const durationMinutes = getUtcDurationMinutes(entryStart, entryEnd);

                    const top = (startMinutesFromTop / 60) * pixelsPerHour;
                    const height = (durationMinutes / 60) * pixelsPerHour;

                    // Only apply smart hover expansion for entries 1 hour or less
                    const isShortEntry = durationMinutes <= 60;

                    return (
                      <div
                        key={entry.id}
                        className={`time-entry ${isShortEntry ? 'smart-hover' : ''}`}
                        title={`${entry.title} - ${formatDuration(entry.start, entry.end)}`}
                        style={{
                          position: 'absolute',
                          top: `${top}px`,
                          height: `${height}px`,
                          minHeight: '22px', // Ensure at least clickable visibility
                          // @ts-ignore
                          '--item-height': `${height}px`,
                          left: '4px',
                          right: '4px',
                          borderLeftColor: entry.color || '#ff4d4f',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          zIndex: 10,
                          padding: '4px 8px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                        onClick={(e) => handleEditEntry(entry, e)}
                      >
                        <div className="entry-content" style={{ marginBottom: 0, flex: 1, minHeight: 0, overflow: 'hidden' }}>
                          <div className="entry-title" style={{ fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {entry.title}
                          </div>
                          {(entry.teamName || entry.projectName) && (
                            <div className="entry-team" style={{ fontSize: '0.7rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {entry.teamName && <span className="team-name">{entry.teamName}</span>}
                              {entry.teamName && entry.projectName && <span> : </span>}
                              {entry.projectName && <span>{projects.find(p => p.id === entry.projectName)?.name || entry.projectName}</span>}
                            </div>
                          )}
                        </div>

                        {/* Always render footer, but it will be hidden by overflow for small items until hover */}
                        <div className="entry-footer" style={{ marginTop: 'auto', paddingTop: '4px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                          <div className="entry-footer-left">
                            <span className="entry-time-range" style={{ fontSize: '0.7rem', marginRight: '8px', color: '#374151' }}>
                              {formatUtcTimeRange(entry.start, entry.end)}
                            </span>
                            <span className="entry-duration" style={{ fontSize: '0.7rem' }}>
                              {formatDuration(entry.start, entry.end)}
                            </span>
                          </div>
                          <div className="entry-actions">
                            <button
                              onClick={(e) => handleDeleteEntry(entry, e)}
                              className="entry-action-btn entry-delete-btn"
                              title="Delete"
                              style={{ padding: '2px' }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
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
        mode={dialogMode}
        initialData={editingEntry}
        initialStartTime={selectedTime}
      />
    </div>
  );
};

export default React.memo(WeeklyCalendar);

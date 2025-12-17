import React, { FC, useMemo, useEffect, useRef, useState, CSSProperties } from 'react';
import { Calendar as RbcCalendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { parse, startOfWeek, getDay, format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { formatInTimeZone } from 'date-fns-tz';
import { CollectiveDayOff } from '@shared/collectiveDayOff.types';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './big-calendar.css';

// Extend CSSProperties to allow custom variables
interface CustomCSSProperties extends CSSProperties {
  '--collective-tooltip-text'?: string;
}

type Event = {
  id: string;
  title: string;
  start: string | Date;
  end: string | Date;
  allDay?: boolean;
  [k: string]: any;
};

type Props = {
  events: Event[];
  defaultView?: View;
  view?: View;
  onView?: (view: View) => void;
  onSelectEvent?: (evt: any) => void;
  onSelectSlot?: (slotInfo: any) => void;
  onNavigate?: (date: Date, view?: View) => void;
  eventPropGetter?: (event: any) => any;
  style?: React.CSSProperties;
  currentDate?: Date;
  collectiveDaysOff?: CollectiveDayOff[];
};

const locales = {
  'en-US': enUS,
};

const TIMEZONE = 'Europe/Belgrade';

const localizer = dateFnsLocalizer({
  format: (date: Date, formatStr: string) => formatInTimeZone(date, TIMEZONE, formatStr),
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

const BigCalendar: FC<Props> = ({ events, defaultView = 'month', view, onView, onSelectEvent, onSelectSlot, onNavigate, eventPropGetter, style, currentDate, collectiveDaysOff = [] }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [internalDate, setInternalDate] = useState(currentDate || new Date());

  const mappedEvents = useMemo(() => {
    // Helper to parse "YYYY-MM-DD" as local midnight date
    // new Date("2025-12-08") is UTC, which shifts to Dec 7 in Western timezones. 
    // We want Dec 8 Local.
    const parseLocalYMD = (dateStr: string) => {
      const [y, m, d] = dateStr.split('-').map(Number);
      return new Date(y, m - 1, d);
    };

    // Helper to check if a specific date is a working day (not weekend, not collective day off)
    const isWorkingDay = (date: Date) => {
      const dayOfWeek = getDay(date);
      // 0 = Sunday, 6 = Saturday
      if (dayOfWeek === 0 || dayOfWeek === 6) return false;

      // Check collective days off
      const isCollectiveOff = collectiveDaysOff.some(dayOff => {
        const start = parseLocalYMD(dayOff.startDate);
        const end = parseLocalYMD(dayOff.endDate);
        // start/end are already at midnight from helper

        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d >= start && d <= end;
      });

      return !isCollectiveOff;
    };

    const processedEvents: Event[] = [];

    events.forEach((e) => {
      const originalStart = typeof e.start === 'string' ? new Date(e.start) : e.start;
      const originalEnd = typeof e.end === 'string' ? new Date(e.end) : e.end;

      // Normalize time to ensure we iterate correctly by days
      let currentSegmentStart: Date | null = null;
      let currentSegmentEnd: Date | null = null;

      // Iterate day by day from start to end
      let iter = new Date(originalStart);
      const end = new Date(originalEnd);

      // Safety break for infinite loops
      let safetyCallback = 0;

      while (iter <= end && safetyCallback < 365) {
        safetyCallback++;

        if (isWorkingDay(iter)) {
          if (!currentSegmentStart) {
            currentSegmentStart = new Date(iter);
          }
          currentSegmentEnd = new Date(iter);
        } else {
          // It's a non-working day. If we have an open segment, close it.
          if (currentSegmentStart && currentSegmentEnd) {
            processedEvents.push({
              ...e,
              id: `${e.id}_seg_${processedEvents.length}`, // Unique ID for React key
              startTimePreserved: e.start, // Optional: preserve for details
              endTimePreserved: e.end,
              start: currentSegmentStart,
              end: currentSegmentEnd,
              title: e.title,
            });
            currentSegmentStart = null;
            currentSegmentEnd = null;
          }
        }

        // Next day
        iter = addDays(iter, 1);
      }

      // Close final segment if exists
      if (currentSegmentStart && currentSegmentEnd) {
        processedEvents.push({
          ...e,
          id: `${e.id}_seg_final_${processedEvents.length}`,
          start: currentSegmentStart,
          end: currentSegmentEnd,
          title: e.title,
        });
      }
    });

    return processedEvents;
  }, [events, collectiveDaysOff]);

  const dayPropGetter = (date: Date) => {
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

    if (matchingDayOff) {
      // 3. Escape double quotes in the text so it doesn't break CSS
      const safeDesc = matchingDayOff.description
        .replace(/\\/g, "\\\\") // Escape backslashes first
        .replace(/"/g, "'")     // Replace double quotes
        .replace(/\n/g, " ");   // Replace newlines with spaces


      return {
        className: 'collective-day-off',
        style: {
          // CRITICAL: We pass the string wrapped in TWO sets of quotes: ` "text" `
          // This ensures CSS receives: content: "Text"; instead of content: Text;
          '--collective-tooltip-text': `"${safeDesc}"`,
        } as React.CSSProperties & { '--collective-tooltip-text': string },
      };
    }
    return {};
  };

  useEffect(() => {
    if (currentDate) {
      setInternalDate(currentDate);
    }
  }, [currentDate]);

  const handleNavigate = (action: 'PREV' | 'NEXT' | 'TODAY') => {
    let newDate: Date;

    if (action === 'TODAY') {
      newDate = new Date();
    } else if (action === 'PREV') {
      if (view === 'month') newDate = subMonths(internalDate, 1);
      else if (view === 'week') newDate = subWeeks(internalDate, 1);
      else if (view === 'day') newDate = subDays(internalDate, 1);
      else newDate = internalDate;
    } else {
      if (view === 'month') newDate = addMonths(internalDate, 1);
      else if (view === 'week') newDate = addWeeks(internalDate, 1);
      else if (view === 'day') newDate = addDays(internalDate, 1);
      else newDate = internalDate;
    }

    setInternalDate(newDate);
    onNavigate?.(newDate, view);
  };

  const CustomToolbar = () => (
    <div className="custom-calendar-toolbar">
      <div className="toolbar-nav">
        <button onClick={() => handleNavigate('TODAY')} className="toolbar-btn">Today</button>
        <button onClick={() => handleNavigate('PREV')} className="toolbar-btn">Prev</button>
        <button onClick={() => handleNavigate('NEXT')} className="toolbar-btn">Next</button>
      </div>
      <div className="toolbar-label">
        {format(internalDate, 'MMMM yyyy')}
      </div>
      <div className="toolbar-views">
        <button onClick={() => onView?.('month')} className={`toolbar-btn ${view === 'month' ? 'active' : ''}`}>Month</button>
        <button onClick={() => onView?.('week')} className={`toolbar-btn ${view === 'week' ? 'active' : ''}`}>Week</button>
        <button onClick={() => onView?.('agenda')} className={`toolbar-btn ${view === 'agenda' ? 'active' : ''}`}>Agenda</button>
      </div>
    </div>
  );

  return (
    <div ref={wrapperRef} className="big-calendar-wrapper" style={{ height: '100%', ...style }}>
      <CustomToolbar />
      <RbcCalendar
        localizer={localizer}
        events={mappedEvents}
        startAccessor="start"
        endAccessor="end"
        defaultView={defaultView}
        view={view}
        onView={onView}
        date={internalDate}
        onNavigate={(date) => {
          setInternalDate(date);
          onNavigate?.(date, view);
        }}
        showMultiDayTimes
        showAllEvents
        onSelectEvent={onSelectEvent}
        selectable
        onSelectSlot={onSelectSlot}
        style={view === 'agenda' ? { height: 'calc(100% - 2.7rem)' } : { height: 'fit-content' }}
        eventPropGetter={eventPropGetter}
        dayPropGetter={dayPropGetter}
        popup={false}
        doShowMoreDrillDown={false}
        views={['month', 'week', 'agenda']}
        toolbar={false}
        components={{
          month: {
            dateHeader: ({ label }: any) => <div className="rbc-date-cell-header">{label}</div>,
          },
        }}
      />
    </div>
  );
};

export default React.memo(BigCalendar);
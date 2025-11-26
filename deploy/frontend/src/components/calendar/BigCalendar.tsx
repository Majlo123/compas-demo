import React, { FC, useMemo, useEffect, useRef, useState } from 'react';
import { Calendar as RbcCalendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { parse, startOfWeek, getDay, format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { formatInTimeZone } from 'date-fns-tz';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './big-calendar.css';

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
  onNavigate?: (date: Date, view?: View) => void;
  eventPropGetter?: (event: any) => any;
  style?: React.CSSProperties;
  currentDate?: Date;
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

const BigCalendar: FC<Props> = ({ events, defaultView = 'month', view, onView, onSelectEvent, onNavigate, eventPropGetter, style, currentDate }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [internalDate, setInternalDate] = useState(currentDate || new Date());
  
  const mappedEvents = useMemo(
    () =>
      events.map((e) => ({
        ...e,
        start: typeof e.start === 'string' ? new Date(e.start) : e.start,
        end: typeof e.end === 'string' ? new Date(e.end) : e.end,
        title: e.title,
      })),
    [events]
  );

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
        style={{ height: 'fit-content' }}
        eventPropGetter={eventPropGetter}
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
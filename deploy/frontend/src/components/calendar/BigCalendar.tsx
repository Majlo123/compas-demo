import React, { FC, useMemo } from 'react';
import { Calendar as RbcCalendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { parse, startOfWeek, getDay } from 'date-fns';
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
  onSelectEvent?: (evt: any) => void;
  onNavigate?: (date: Date, view?: View) => void;
  eventPropGetter?: (event: any) => any;
  style?: React.CSSProperties;
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

const BigCalendar: FC<Props> = ({ events, defaultView = 'month', view, onSelectEvent, onNavigate, eventPropGetter, style }) => {
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

  return (
    <div className="big-calendar-wrapper" style={style}>
      <RbcCalendar
        localizer={localizer}
        events={mappedEvents}
        startAccessor="start"
        endAccessor="end"
        defaultView={defaultView}
        view={view}
        onSelectEvent={onSelectEvent}
        onNavigate={onNavigate}
        style={{ height: '100%', minHeight: 600 }}
        eventPropGetter={eventPropGetter}
      />
    </div>
  );
};

export default React.memo(BigCalendar);
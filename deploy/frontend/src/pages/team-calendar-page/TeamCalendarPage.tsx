import BigCalendar from '@/components/calendar/BigCalendar';
import CustomDialog from '@/components/dialog/dialog-props';
import React, { useState } from 'react';
import { getCalendarLeaveRequests } from '@/api/leave-request/leaveRequest.actions';
import { isApiSuccess } from '@/api/shared.types';
import { LeaveRequestWithEmployee } from '@/api/leave-request/leaveRequest.types';
import { format } from 'date-fns';
import { LeaveRequest } from '@/api/leave-request/leaveRequest.types';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../tailwind.config';

const fullConfig = resolveConfig(tailwindConfig);

const getLeaveTypeColor = (type: string): string => {
  const colors = fullConfig.theme.colors as any;
  switch (type) {
    case 'vacation':
      return colors['vacation-leave'];
    case 'sick':
      return colors['sick-leave'];
    case 'personal':
      return colors['personal-leave'];
    case 'other':
      return colors['other-leave'];
    default:
      return colors.primary;
  }
};

const TeamCalendarPage: React.FC = () => {
  const [eventsToShow, setEventsToShow] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getCalendarLeaveRequests();
        if (isApiSuccess(response)) {
          const data = response.content as LeaveRequestWithEmployee[];
          const filtered = data.filter((r) => r.status === 'approved' || r.status === 'pending');

          const mapped = filtered.map((r) => {
            const start = new Date(r.startDate);
            const end = new Date(r.endDate);
            end.setDate(end.getDate());

            return {
              id: r.id,
              title: r.employeeName || r.type,
              // include employee name so tooltip and dialog can read it
              employeeName: r.employeeName,
              user: r.employeeName,
              start,
              end,
              allDay: true,
              type: r.type,
              status: r.status,
              reason: r.reason,
            };
          });

          console.debug('TeamCalendar: fetched', mapped.length, 'events');
          setEventsToShow(mapped);
        } else {
          console.error('Failed to load calendar leave requests', response);
        }
      } catch (err) {
        console.error('Error fetching calendar leave requests', err);
      }
    };

    fetchEvents();
  }, []);

  const eventPropGetter = (event: any) => ({
    style: {
      "--tooltip-text": `"${event.type} - ${event.employeeName || event.user || event.title}"`,
      backgroundColor: getLeaveTypeColor(event.type),
      opacity: 1,
      backgroundImage: event.status === 'pending'
        ? 'repeating-linear-gradient(45deg, rgba(255,255,255,0.3) 0, rgba(255,255,255,0.3) 2px, transparent 2px, transparent 4px)'
        : undefined,
    },
  });

  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Legend */}
      <div className="flex items-center gap-6 mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-vacation-leave"></div>
          <span className="text-sm font-medium text-gray-700">Vacation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-sick-leave"></div>
          <span className="text-sm font-medium text-gray-700">Sick Leave</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-personal-leave"></div>
          <span className="text-sm font-medium text-gray-700">Personal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-other-leave"></div>
          <span className="text-sm font-medium text-gray-700">Other</span>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <div className="w-4 h-4 rounded border-2 border-gray-400" style={{ 
            background: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.1) 0, rgba(0,0,0,0.1) 2px, transparent 2px, transparent 4px)'
          }}></div>
          <span className="text-sm font-medium text-gray-700">Pending</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 h-full">
          <BigCalendar 
            events={eventsToShow} 
            eventPropGetter={eventPropGetter} 
            view={view}
            currentDate={currentDate}
            onView={(v) => setView(v as any)}
            onNavigate={(newDate) => setCurrentDate(newDate)}
            onSelectEvent={handleEventClick}
          />
      </div>

      {/* Event Details Dialog */}
      {selectedEvent && (
        <CustomDialog
          title="Leave Request Details"
          isOpen={dialogOpen}
          onOpenChange={setDialogOpen}
        >
          <div className="space-y-3">
            <div>
              <span className="font-semibold text-gray-700">User:</span>
              <p className="text-gray-900">{selectedEvent.employeeName || selectedEvent.user || selectedEvent.title}</p>
            </div>
            
            <div>
              <span className="font-semibold text-gray-700">Type:</span>
              <p className="text-gray-900 capitalize">{selectedEvent.type}</p>
            </div>
            
            <div>
              <span className="font-semibold text-gray-700">Status:</span>
              <p className={`capitalize ${selectedEvent.status === 'approved' ? 'text-green-600' : 'text-yellow-600'}`}>
                {selectedEvent.status === 'approved' ? 'Approved' : 'Pending'}
              </p>
            </div>
            
            <div>
              <span className="font-semibold text-gray-700">Period:</span>
              <p className="text-gray-900">
                {selectedEvent.allDay ? (
                  <>
                    {format(new Date(selectedEvent.start), 'dd.MM.yyyy')} - {format(new Date(selectedEvent.end), 'dd.MM.yyyy')}
                  </>
                ) : (
                  <>
                    {format(new Date(selectedEvent.start), 'dd.MM.yyyy HH:mm')} - {format(new Date(selectedEvent.end), 'dd.MM.yyyy HH:mm')}
                  </>
                )}
              </p>
            </div>
          </div>
        </CustomDialog>
      )}
    </div>
  );
};

export default TeamCalendarPage;

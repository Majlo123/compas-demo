import BigCalendar from '@/components/calendar/BigCalendar';
import CustomDialog from '@/components/dialog/dialog-props';
import React, { useState } from 'react';
import { getCalendarLeaveRequests } from '@/api/leave-request/leaveRequest.actions';
import { isApiSuccess } from '@/api/shared.types';
import { LeaveRequestWithEmployee } from '@/api/leave-request/leaveRequest.types';
import { format } from 'date-fns';
import { LeaveRequest } from '@/api/leave-request/leaveRequest.types';

const STATUS_COLORS: Record<string, string> = {
  vacation: '#4CAF50',
  sick: '#1E88E5',
  personal: '#E53935',
  other: '#E53935'
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
              title: r.employeeName ? `${r.employeeName} - ${r.type}` : r.type,
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
      backgroundColor: STATUS_COLORS[event.type] || '#1E88E5',
      opacity: event.status === 'pending' ? 0.65 : 1,
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
          title="Detalji zahteva"
          isOpen={dialogOpen}
          onOpenChange={setDialogOpen}
        >
          <div className="space-y-3">
            <div>
              <span className="font-semibold text-gray-700">Naslov:</span>
              <p className="text-gray-900">{selectedEvent.title}</p>
            </div>
            
            <div>
              <span className="font-semibold text-gray-700">Korisnik:</span>
              <p className="text-gray-900">{selectedEvent.employeeName || selectedEvent.user || selectedEvent.title}</p>
            </div>
            
            <div>
              <span className="font-semibold text-gray-700">Tip:</span>
              <p className="text-gray-900 capitalize">{selectedEvent.type}</p>
            </div>
            
            <div>
              <span className="font-semibold text-gray-700">Status:</span>
              <p className={`capitalize ${selectedEvent.status === 'approved' ? 'text-green-600' : 'text-yellow-600'}`}>
                {selectedEvent.status === 'approved' ? 'Odobreno' : 'Na čekanju'}
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

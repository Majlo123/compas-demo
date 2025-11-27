import BigCalendar from '@/components/calendar/BigCalendar';
import CustomDialog from '@/components/dialog/dialog-props';
import React, { useState } from 'react';
import sampleEvents from '@/components/calendar/sampleEvents';
import { format } from 'date-fns';

const TeamCalendarPage: React.FC = () => {
  // Only show approved and pending
  const eventsToShow = sampleEvents.filter((e) => e.status === 'approved' || e.status === 'pending');

  const eventPropGetter = (event: any) => ({
    style: {
      backgroundColor: event.color || '#1E88E5',
      opacity: event.status === 'pending' ? 0.65 : 1,
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
              <p className="text-gray-900">{selectedEvent.user}</p>
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

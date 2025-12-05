import BigCalendar from '@/components/calendar/BigCalendar';
import CustomDialog from '@/components/dialog/dialog-props';
import React, { useState } from 'react';
import { getCalendarLeaveRequests } from '@/api/leave-request/leaveRequest.actions';
import { getTeams, getTeamsByUserId } from '@/api/team/team.actions';
import { isApiSuccess } from '@/api/shared.types';
import { LeaveRequestWithEmployee } from '@/api/leave-request/leaveRequest.types';
import { Team } from '@/api/team/team.types';
import { format } from 'date-fns';
import Select, { SelectOption } from '@/components/controls/Select';
import { useAuthStore } from '@/stores/useAuthStore';
import { RoleEnum } from '../../../../shared/auth.types';
import { getLeaveTypeColor } from '@/utils/colorUtils';

const TeamCalendarPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const [eventsToShow, setEventsToShow] = React.useState<any[]>([]);
  const [allEvents, setAllEvents] = React.useState<any[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<SelectOption | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set(['vacation', 'sick', 'personal', 'other']));
  const [showPending, setShowPending] = useState(true);

  // Load teams on mount based on user role
  React.useEffect(() => {
    const loadTeams = async () => {
      if (!user) return;
      
      if (user.role === RoleEnum.Admin) {
        const response = await getTeams();
        if (isApiSuccess(response)) {
          setTeams(response.content.data);
        }
      } else {
        const response = await getTeamsByUserId(user.id);
        if (isApiSuccess(response)) {
          setTeams(response.content.data);
        }
      }
    };
    loadTeams();
  }, [user]);

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const teamId = selectedTeam?.value;
        const response = await getCalendarLeaveRequests(teamId);
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
          setAllEvents(mapped);
        } else {
          console.error('Failed to load calendar leave requests', response);
        }
      } catch (err) {
        console.error('Error fetching calendar leave requests', err);
      }
    };

    fetchEvents();
  }, [selectedTeam]);

  // Filter events based on selected types and pending status
  React.useEffect(() => {
    const filtered = allEvents.filter(event => {
      const typeMatch = selectedTypes.has(event.type);
      const statusMatch = event.status === 'approved' || (event.status === 'pending' && showPending);
      return typeMatch && statusMatch;
    });
    setEventsToShow(filtered);
  }, [allEvents, selectedTypes, showPending]);

  const toggleType = (type: string) => {
    setSelectedTypes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };

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
      {/* Filter and Legend Section */}
      <div className="flex items-center justify-between gap-6 mb-4 px-2">
        <div className="flex items-center gap-3">
          <Select 
            className="text-p1 w-64" 
            placeholder="Filter by Team" 
            options={teams.map(team => ({ label: team.name, value: team.id }))} 
            value={selectedTeam} 
            onChange={setSelectedTeam}
          />
          {selectedTeam && (
            <button
              onClick={() => setSelectedTeam(null)}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Clear filter
            </button>
          )}
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => toggleType('vacation')}
            className={`flex items-center gap-2 cursor-pointer transition-all duration-200 ${
              selectedTypes.has('vacation') ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <div className={`w-4 h-4 rounded bg-vacation-leave flex items-center justify-center text-white text-xs font-bold transition-all duration-200 ${
              selectedTypes.has('vacation') ? 'ring-2 ring-vacation-leave ring-offset-1' : ''
            }`}>
              {selectedTypes.has('vacation') && '✓'}
            </div>
            <span className="text-sm font-medium text-gray-700">Vacation</span>
          </button>
          <button 
            onClick={() => toggleType('sick')}
            className={`flex items-center gap-2 cursor-pointer transition-all duration-200 ${
              selectedTypes.has('sick') ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <div className={`w-4 h-4 rounded bg-sick-leave flex items-center justify-center text-white text-xs font-bold transition-all duration-200 ${
              selectedTypes.has('sick') ? 'ring-2 ring-sick-leave ring-offset-1' : ''
            }`}>
              {selectedTypes.has('sick') && '✓'}
            </div>
            <span className="text-sm font-medium text-gray-700">Sick Leave</span>
          </button>
          <button 
            onClick={() => toggleType('personal')}
            className={`flex items-center gap-2 cursor-pointer transition-all duration-200 ${
              selectedTypes.has('personal') ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <div className={`w-4 h-4 rounded bg-personal-leave flex items-center justify-center text-white text-xs font-bold transition-all duration-200 ${
              selectedTypes.has('personal') ? 'ring-2 ring-personal-leave ring-offset-1' : ''
            }`}>
              {selectedTypes.has('personal') && '✓'}
            </div>
            <span className="text-sm font-medium text-gray-700">Personal</span>
          </button>
          <button 
            onClick={() => toggleType('other')}
            className={`flex items-center gap-2 cursor-pointer transition-all duration-200 ${
              selectedTypes.has('other') ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <div className={`w-4 h-4 rounded bg-other-leave flex items-center justify-center text-white text-xs font-bold transition-all duration-200 ${
              selectedTypes.has('other') ? 'ring-2 ring-other-leave ring-offset-1' : ''
            }`}>
              {selectedTypes.has('other') && '✓'}
            </div>
            <span className="text-sm font-medium text-gray-700">Other</span>
          </button>
          <button 
            onClick={() => setShowPending(!showPending)}
            className={`flex items-center gap-2 cursor-pointer transition-all duration-200 ${
              showPending ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <div className={`w-4 h-4 rounded border-2 border-gray-400 flex items-center justify-center text-gray-700 text-xs font-bold transition-all duration-200 ${
              showPending ? 'ring-2 ring-gray-400 ring-offset-1' : ''
            }`} style={{ 
              background: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.1) 0, rgba(0,0,0,0.1) 2px, transparent 2px, transparent 4px)'
            }}>
              {showPending && '✓'}
            </div>
            <span className="text-sm font-medium text-gray-700">Pending</span>
          </button>
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

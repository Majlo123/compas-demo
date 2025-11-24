import BigCalendar from '@/components/calendar/BigCalendar';
import React from 'react';

const TeamCalendarPage: React.FC = () => {
  return (
    <>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">Team Calendar</h1>
      </div>
      
      {/* Content Area */}
      <BigCalendar events={[]} />
    </>
  );
};

export default TeamCalendarPage;

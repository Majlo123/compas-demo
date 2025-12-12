import React, { useEffect, useState } from 'react';
import { WidgetComponentProps } from '@/components/dashboard/WidgetRenderer';
import { getCalendarLeaveRequests } from '@/api/leave-request/leaveRequest.actions';
import { LeaveRequest } from '@/api/leave-request/leaveRequest.types';
import { isApiSuccess } from '@/api/shared.types';
import { getLeaveTypeColor } from '@/utils/colorUtils';

interface AbsentUser {
  id: string;
  name: string;
  type: string;
}

const AbsentTodayWidget: React.FC<WidgetComponentProps> = () => {
  const [absentUsers, setAbsentUsers] = useState<AbsentUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAbsentToday();
  }, []);

  const fetchAbsentToday = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getCalendarLeaveRequests();

      if (isApiSuccess(response)) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter approved leave requests that include today
        const todayAbsent = response.content
          .filter((request: LeaveRequest) => {
            if (request.status !== 'approved') return false;

            const startDate = new Date(request.startDate);
            const endDate = new Date(request.endDate);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);

            return startDate <= today && endDate >= today;
          })
          .map((request: LeaveRequest) => ({
            id: request.id,
            name: (request as any).employeeName || 'Unknown User',
            type: request.type,
          }));

        setAbsentUsers(todayAbsent);
      } else {
        setError('Failed to load absent users');
      }
    } catch (err) {
      console.error('Error fetching absent users:', err);
      setError('Failed to load absent users');
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeColor = (type: string): string => {
    return getLeaveTypeColor(type);
  };

  const getTypeTextClass = (type: string): string => {
    switch (type) {
      case 'vacation':
        return 'text-blue-600';
      case 'sick':
        return 'text-red-600';
      case 'personal':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-red-500 text-sm text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex gap-3 min-h-0">
        {/* Left Side - Count */}
        <div className="flex-shrink-0 w-1/3 bg-orange-50 rounded-lg p-4 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-orange-600">{absentUsers.length}</div>
          <div className="text-xs text-gray-600 text-center mt-1">
            {absentUsers.length === 1 ? 'person' : 'people'} on leave
          </div>
        </div>

        {/* Right Side - Preview List */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {absentUsers.length === 0 ? (
            <div className="flex items-center justify-center text-gray-500 text-sm">
              <p>🎉 Everyone is working today!</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2">
              <div className="space-y-2">
                {absentUsers.slice(0, 5).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs flex-shrink-0"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: getTypeColor(user.type) }}
                      />
                      <span className="font-medium text-gray-800 truncate">{user.name}</span>
                    </div>
                    <span className={`text-xs font-medium ${getTypeTextClass(user.type)} flex-shrink-0 ml-2`}>
                      {getTypeLabel(user.type)}
                    </span>
                  </div>
                ))}
                {absentUsers.length > 5 && (
                  <div className="text-xs text-gray-500 text-center pt-2 flex-shrink-0">
                    +{absentUsers.length - 5} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AbsentTodayWidget;

import React, { useEffect, useState } from 'react';
import { getUpcomingVacations } from '@/api/widget/widget.actions';
import { isApiSuccess } from '@/api/shared.types';
import { UpcomingVacations } from '@/api/widget/widget.types';

// Color palette for leave types using Tailwind config
const COLORS: Record<string, string> = {
  vacation: '#3B82F6',
  sick: '#EF4444',
  personal: '#10B981',
  other: '#6B7280',
  unpaid: '#6B7280',
  maternity: '#3B82F6',
  paternity: '#3B82F6',
};

type TimeRange = 'week' | 'month';

const UpcomingVacationsWidget: React.FC = () => {
  const [vacations, setVacations] = useState<UpcomingVacations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('week');

  const fetchVacations = async (days: number) => {
    setLoading(true);
    setError(null);
    const res = await getUpcomingVacations(days);
    if (isApiSuccess(res)) {
      setVacations(res.content);
    } else if ('message' in res) {
      setError(res.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVacations(timeRange === 'week' ? 7 : 30);
  }, [timeRange]);

  const getTypeColor = (type: string): string => {
    return COLORS[type] || COLORS.other;
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

  const formatDateRange = (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const sameMonth = start.getMonth() === end.getMonth();
    
    if (sameMonth) {
      return `${start.toLocaleDateString('en-US', { month: 'short' })} ${start.getDate()}-${end.getDate()}`;
    }
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  if (loading) {
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
      {/* Header with Toggle */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-blue-600">{vacations?.total ?? 0}</div>
          <div className="text-xs text-gray-600">
            {vacations?.total === 1 ? 'person' : 'people'}
          </div>
        </div>
        
        {/* Toggle Week/Month */}
        <div className="flex rounded-md bg-gray-100 p-0.5">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
              timeRange === 'week'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
              timeRange === 'month'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1">
        {vacations?.leaves.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            <p>🎉 No upcoming vacations</p>
          </div>
        ) : (
          <div className="space-y-2">
            {vacations?.leaves.map((leave) => (
              <div
                key={leave.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getTypeColor(leave.type) }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{leave.employeeName}</p>
                    <p className="text-gray-500">{formatDateRange(leave.startDate, leave.endDate)}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5 flex-shrink-0 ml-2">
                  <span className={`text-xs font-medium ${getTypeTextClass(leave.type)}`}>
                    {getTypeLabel(leave.type)}
                  </span>
                  <span className="text-xs text-gray-500">{leave.days}d</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingVacationsWidget;

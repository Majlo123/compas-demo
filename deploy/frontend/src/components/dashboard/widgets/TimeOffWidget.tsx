import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMyTimeOffSummary } from '@/api/widget/widget.actions';
import { isApiSuccess } from '@/api/shared.types';
import { TimeOffSummary } from '@/api/widget/widget.types';
import { getLeaveTypeColor } from '@/utils/colorUtils';

// Color palette for leave types using Tailwind config
const COLORS: Record<string, string> = {
  vacation: '#3B82F6', // vacation-leave from tailwind config
  sick: '#EF4444',     // sick-leave from tailwind config
  personal: '#10B981', // personal-leave from tailwind config
  other: '#6B7280',    // other-leave from tailwind config
  unpaid: '#6B7280',
  maternity: '#3B82F6',
  paternity: '#3B82F6',
};

const TimeOffWidget: React.FC = () => {
  const [summary, setSummary] = useState<TimeOffSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchSummary = async (date: Date) => {
    setLoading(true);
    setError(null);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed
    const res = await getMyTimeOffSummary(year, month);
    if (isApiSuccess(res)) {
      setSummary(res.content);
    } else if ('message' in res) {
      setError(res.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSummary(selectedDate);
  }, [selectedDate]);

  const handlePreviousMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  const monthYear = selectedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  // Transform breakdown data for pie chart
  const pieData = summary?.breakdown.map((item) => ({
    name: item.type.replace('_', ' ').charAt(0).toUpperCase() + item.type.replace('_', ' ').slice(1),
    value: item.days,
    type: item.type,
  })) || [];

  return (
    <div className="h-full flex flex-col gap-1.5 p-2">
      {/* Header with Total and Month Selector */}
      <div className="flex items-center justify-between gap-1.5">
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold text-gray-900">
            {loading ? '—' : summary?.totalDays ?? 0}
            <span className="text-[10px] font-normal text-gray-500 ml-1">days</span>
          </p>
        </div>
        
        {/* Month Navigation */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={handlePreviousMonth}
            className="w-5 h-5 rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-3 h-3 text-gray-600" />
          </button>
          <span className="text-[9px] font-medium text-gray-700 min-w-[50px] text-center">
            {monthYear}
          </span>
          <button
            onClick={handleNextMonth}
            className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Chart and Breakdown */}
      <div className="flex-1 flex items-center gap-2 min-h-0">
        {loading && (
          <div className="flex items-center justify-center w-full text-[10px] text-gray-400">
            Loading...
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center w-full text-[10px] text-red-500">
            {error}
          </div>
        )}

        {!loading && !error && summary && summary.breakdown.length === 0 && (
          <div className="flex items-center justify-center w-full text-[10px] text-gray-400">
            No approved leaves
          </div>
        )}

        {!loading && !error && summary && summary.breakdown.length > 0 && (
          <>
            {/* Compact Pie Chart */}
            <div className="w-16 h-16 flex-shrink-0 min-w-[64px] min-h-[64px]">
              <ResponsiveContainer width={64} height={64} minWidth={64} minHeight={64}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={14}
                    outerRadius={26}
                    paddingAngle={1}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.type] || '#9ca3af'} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${value} days`}
                    contentStyle={{ 
                      fontSize: '10px',
                      borderRadius: '4px', 
                      border: 'none', 
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      padding: '3px 6px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Compact Legend */}
            <div className="flex-1 flex flex-col gap-1 min-w-0">
              {summary.breakdown.map((item) => (
                <div key={item.type} className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: COLORS[item.type] || '#9ca3af' }}
                  />
                  <span className="text-[10px] text-gray-600 capitalize truncate">
                    {item.type.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-900 flex-shrink-0">{item.days} days</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TimeOffWidget;

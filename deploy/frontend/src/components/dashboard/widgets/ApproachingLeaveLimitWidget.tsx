import React, { useEffect, useState } from 'react';
import { WidgetComponentProps } from '@/components/dashboard/WidgetRenderer';
import axiosServer from '@/services/axios';

interface User {
  id: string;
  fullName: string;
  email: string;
  remainingDays: number;
  initialDays: number;
  teams: Array<{ teamId: string; teamName: string }>;
}

interface ApproachingLeaveLimitData {
  total: number;
  users: User[];
}

const ApproachingLeaveLimitWidget: React.FC<WidgetComponentProps> = () => {
  const [data, setData] = useState<ApproachingLeaveLimitData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosServer.get('/widgets/approaching-leave-limit', {
        params: { threshold: 5 },
      });

      if (response.data && response.data.success && response.data.content) {
        setData(response.data.content);
      } else {
        setError('Failed to load data');
      }
    } catch (err) {
      console.error('Error fetching approaching leave limit:', err);
      setError('Failed to load approaching leave limit');
    } finally {
      setIsLoading(false);
    }
  };

  const getBadgeColor = (remaining: number): string => {
    if (remaining <= 2) return 'bg-red-100 text-red-700';
    if (remaining <= 5) return 'bg-amber-100 text-amber-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const getBadgeIcon = (remaining: number): string => {
    if (remaining === 0) return '🚫';
    if (remaining <= 2) return '🔴';
    if (remaining <= 5) return '🟡';
    return '🟢';
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading...</div>
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
    <div className="h-full flex flex-col gap-3">
      {/* Header with count */}
      <div className="flex-shrink-0">
        <div className="text-2xl font-bold text-amber-600">{data?.total ?? 0}</div>
        <div className="text-xs text-gray-600">
          {data?.total === 1 ? 'employee' : 'employees'} nearing limit
        </div>
      </div>

      {/* Users list */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1">
        {data && data.users.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            <p>✅ All set with leave balance</p>
          </div>
        ) : (
          <div className="space-y-2">
            {data?.users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs gap-2"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{user.fullName}</p>
                  {user.teams.length > 0 && (
                    <p className="text-gray-500 text-[11px] truncate">
                      {user.teams.map((t) => t.teamName).join(', ')}
                    </p>
                  )}
                </div>
                <div className={`flex-shrink-0 px-2 py-1 rounded font-semibold whitespace-nowrap ${getBadgeColor(user.remainingDays)}`}>
                  {getBadgeIcon(user.remainingDays)} {user.remainingDays} days
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproachingLeaveLimitWidget;

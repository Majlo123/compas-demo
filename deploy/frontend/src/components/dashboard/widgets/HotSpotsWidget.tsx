import React, { useEffect, useState } from 'react';
import { WidgetComponentProps } from '@/components/dashboard/WidgetRenderer';
import { getHotSpots } from '@/api/widget/widget.actions';
import { getAllCollectiveDaysOff } from '@/api/collective-day-off/collectiveDayOff.actions';
import { isApiSuccess } from '@/api/shared.types';
import { CollectiveDayOff } from '../../../../shared/collectiveDayOff.types';

interface DayHeatData {
  date: string;
  absenceCount: number;
  intensity: number; // 0-4 based on absence count
}

interface MonthData {
  year: number;
  month: number;
  days: DayHeatData[];
}

interface HotSpotsResponse {
  months: MonthData[];
}

const HotSpotsWidget: React.FC<WidgetComponentProps> = () => {
  const [months, setMonths] = useState<MonthData[]>([]);
  const [collectiveDaysOff, setCollectiveDaysOff] = useState<CollectiveDayOff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHotSpots();
  }, []);

  const fetchHotSpots = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [hotSpotsResponse, daysOffResponse] = await Promise.all([
        getHotSpots(),
        getAllCollectiveDaysOff(),
      ]);

      if (isApiSuccess(hotSpotsResponse)) {
        const data = hotSpotsResponse.content as HotSpotsResponse;
        setMonths(data.months || []);
      } else {
        setError('Failed to load hot spots');
      }

      if (isApiSuccess(daysOffResponse)) {
        setCollectiveDaysOff(daysOffResponse.content || []);
      }
    } catch (err) {
      console.error('Error fetching hot spots:', err);
      setError('Failed to load hot spots');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  // Get intensity colors (GitHub-style heatmap)
  const getIntensityColor = (intensity: number): string => {
    switch (intensity) {
      case 0:
        return '#EBEDF0'; // Light gray - no absences
      case 1:
        return '#C6E48B'; // Light green
      case 2:
        return '#7BC86F'; // Medium green
      case 3:
        return '#239A3B'; // Dark green
      case 4:
        return '#0C3B1A'; // Very dark green
      default:
        return '#EBEDF0';
    }
  };

  const getMonthLabel = (year: number, month: number): string => {
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const getDayOfWeek = (year: number, month: number, day: number): number => {
    return new Date(year, month - 1, day).getDay();
  };

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month, 0).getDate();
  };

  const renderMonthCalendar = (monthData: MonthData) => {
    const daysInMonth = getDaysInMonth(monthData.year, monthData.month);
    const firstDayOfWeek = getDayOfWeek(monthData.year, monthData.month, 1);

    // Create a map of dates to data
    const dateMap = new Map(
      monthData.days.map((d) => [new Date(d.date).getDate(), d])
    );

    const weeks: (DayHeatData | null)[][] = [];
    let currentWeek: (DayHeatData | null)[] = Array(firstDayOfWeek).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      const dayData = dateMap.get(day) || {
        date: new Date(monthData.year, monthData.month - 1, day)
          .toISOString()
          .split('T')[0],
        absenceCount: 0,
        intensity: 0,
      };

      currentWeek.push(dayData);

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    const isWeekend = (dayOfWeek: number): boolean => {
      return dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday
    };

    const isCollectiveDayOff = (dateStr: string): boolean => {
      return collectiveDaysOff.some(dayOff => {
        const start = new Date(dayOff.startDate);
        const end = new Date(dayOff.endDate);
        const date = new Date(dateStr);
        
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);
        
        return date >= start && date <= end;
      });
    };

    return (
      <div key={`${monthData.year}-${monthData.month}`} className="flex flex-col items-center">
        <div className="text-xs font-semibold text-gray-700 mb-2">
          {getMonthLabel(monthData.year, monthData.month)}
        </div>
        <div className="inline-block">
          <div className="flex gap-0.5 mb-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
              <div
                key={day}
                className={`w-4 h-4 text-xs font-medium flex items-center justify-center ${
                  isWeekend(idx) ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
          <div>
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex gap-0.5">
                {week.map((dayData, dayIdx) => {
                  const dayNum = dayData ? new Date(dayData.date).getDate() : null;
                  const isWeekendDay = dayNum && isWeekend(getDayOfWeek(monthData.year, monthData.month, dayNum));
                  const isDayOff = dayData && isCollectiveDayOff(dayData.date);
                  const isNonWorking = isWeekendDay || isDayOff;
                  
                  return (
                    <div
                      key={dayIdx}
                      className={`w-4 h-4 rounded-sm transition-all ${
                        dayData && !isNonWorking
                          ? 'cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-gray-400'
                          : isNonWorking
                          ? 'opacity-30'
                          : ''
                      }`}
                      style={{
                        backgroundColor:
                          dayData && !isNonWorking
                            ? getIntensityColor(dayData.intensity)
                            : isNonWorking
                            ? getIntensityColor(0)
                            : 'transparent',
                      }}
                      title={
                        dayData && !isNonWorking && dayData.absenceCount > 0
                          ? `${dayData.date}: ${dayData.absenceCount} absence${dayData.absenceCount > 1 ? 's' : ''}`
                          : dayData && !isNonWorking
                          ? `${dayData.date}: No absences`
                          : isDayOff
                          ? `${dayData?.date}: Day Off`
                          : isWeekendDay
                          ? `${dayData?.date}: Weekend`
                          : ''
                      }
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 gap-6">
          {months.length > 0 ? (
            months.map((monthData) => renderMonthCalendar(monthData))
          ) : (
            <div className="text-center text-gray-500 col-span-3">No data available</div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs font-semibold text-gray-600 mb-2">Intensity Legend:</div>
        <div className="flex gap-2 items-center flex-wrap">
          <div className="flex items-center gap-1">
            <div
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: getIntensityColor(0) }}
            />
            <span className="text-xs text-gray-600">None</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: getIntensityColor(1) }}
            />
            <span className="text-xs text-gray-600">Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: getIntensityColor(2) }}
            />
            <span className="text-xs text-gray-600">Med</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: getIntensityColor(3) }}
            />
            <span className="text-xs text-gray-600">High</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: getIntensityColor(4) }}
            />
            <span className="text-xs text-gray-600">Very High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotSpotsWidget;

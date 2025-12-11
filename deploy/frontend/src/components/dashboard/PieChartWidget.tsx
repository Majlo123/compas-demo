import React from 'react';
import { WidgetComponentProps } from '@/components/dashboard/WidgetRenderer';

const PieChartWidget: React.FC<WidgetComponentProps> = () => (
  <div className="h-full flex flex-col">
    <h3 className="text-sm font-semibold text-gray-700 mb-2">Leave Types Distribution</h3>
    <div className="flex-1 flex items-center justify-center">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="#10B981"
            strokeWidth="20"
            strokeDasharray="125.6 251.2"
            transform="rotate(-90 50 50)"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="#3B82F6"
            strokeWidth="20"
            strokeDasharray="62.8 251.2"
            strokeDashoffset="-125.6"
            transform="rotate(-90 50 50)"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="#F59E0B"
            strokeWidth="20"
            strokeDasharray="37.7 251.2"
            strokeDashoffset="-188.4"
            transform="rotate(-90 50 50)"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="#EF4444"
            strokeWidth="20"
            strokeDasharray="25.1 251.2"
            strokeDashoffset="-226.1"
            transform="rotate(-90 50 50)"
          />
        </svg>
      </div>
      <div className="ml-4 text-xs space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-sm"></span>Vacation
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-blue-500 rounded-sm"></span>Sick
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-yellow-500 rounded-sm"></span>Personal
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-sm"></span>Other
        </div>
      </div>
    </div>
  </div>
);

export default PieChartWidget;

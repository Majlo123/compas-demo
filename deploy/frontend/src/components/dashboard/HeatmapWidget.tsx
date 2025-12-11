import React from 'react';
import { WidgetComponentProps } from '@/components/dashboard/WidgetRenderer';

const HeatmapWidget: React.FC<WidgetComponentProps> = () => (
  <div className="h-full flex flex-col">
    <h3 className="text-sm font-semibold text-gray-700 mb-2">Leave Request Heatmap</h3>
    <div className="flex-1 bg-gray-50 rounded flex items-center justify-center">
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-sm ${
              Math.random() > 0.7
                ? 'bg-primary'
                : Math.random() > 0.5
                ? 'bg-primary/50'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  </div>
);

export default HeatmapWidget;

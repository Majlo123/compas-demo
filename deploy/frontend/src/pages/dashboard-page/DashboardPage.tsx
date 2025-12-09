import React, { useState } from 'react';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import PageLayout from '@/components/layout/PageLayout';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Sample widget components
const HeatmapWidget: React.FC = () => (
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

const PieChartWidget: React.FC = () => (
  <div className="h-full flex flex-col">
    <h3 className="text-sm font-semibold text-gray-700 mb-2">Leave Types Distribution</h3>
    <div className="flex-1 flex items-center justify-center">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" strokeWidth="20" strokeDasharray="125.6 251.2" transform="rotate(-90 50 50)" />
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3B82F6" strokeWidth="20" strokeDasharray="62.8 251.2" strokeDashoffset="-125.6" transform="rotate(-90 50 50)" />
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F59E0B" strokeWidth="20" strokeDasharray="37.7 251.2" strokeDashoffset="-188.4" transform="rotate(-90 50 50)" />
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#EF4444" strokeWidth="20" strokeDasharray="25.1 251.2" strokeDashoffset="-226.1" transform="rotate(-90 50 50)" />
        </svg>
      </div>
      <div className="ml-4 text-xs space-y-1">
        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded-sm"></span>Vacation</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 rounded-sm"></span>Sick</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-yellow-500 rounded-sm"></span>Personal</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-sm"></span>Other</div>
      </div>
    </div>
  </div>
);

const StatsWidget: React.FC = () => (
  <div className="h-full flex flex-col">
    <h3 className="text-sm font-semibold text-gray-700 mb-2">Quick Stats</h3>
    <div className="flex-1 grid grid-cols-2 gap-2">
      <div className="bg-primary/10 rounded-lg p-3 flex flex-col justify-center">
        <span className="text-2xl font-bold text-primary">15</span>
        <span className="text-xs text-gray-600">Days Left</span>
      </div>
      <div className="bg-green-100 rounded-lg p-3 flex flex-col justify-center">
        <span className="text-2xl font-bold text-green-600">6</span>
        <span className="text-xs text-gray-600">Days Used</span>
      </div>
      <div className="bg-yellow-100 rounded-lg p-3 flex flex-col justify-center">
        <span className="text-2xl font-bold text-yellow-600">2</span>
        <span className="text-xs text-gray-600">Pending</span>
      </div>
      <div className="bg-blue-100 rounded-lg p-3 flex flex-col justify-center">
        <span className="text-2xl font-bold text-blue-600">3</span>
        <span className="text-xs text-gray-600">Approved</span>
      </div>
    </div>
  </div>
);

const UpcomingLeavesWidget: React.FC = () => (
  <div className="h-full flex flex-col">
    <h3 className="text-sm font-semibold text-gray-700 mb-2">Upcoming Leaves</h3>
    <div className="flex-1 overflow-auto">
      <div className="space-y-2">
        {[
          { name: 'John Doe', date: 'Dec 20-24', type: 'Vacation' },
          { name: 'Jane Smith', date: 'Dec 23-27', type: 'Personal' },
          { name: 'Bob Johnson', date: 'Dec 26-30', type: 'Vacation' },
        ].map((leave, i) => (
          <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
            <div>
              <p className="font-medium text-gray-800">{leave.name}</p>
              <p className="text-gray-500">{leave.date}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs ${
              leave.type === 'Vacation' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {leave.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TeamOverviewWidget: React.FC = () => (
  <div className="h-full flex flex-col">
    <h3 className="text-sm font-semibold text-gray-700 mb-2">Team Overview</h3>
    <div className="flex-1 overflow-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="pb-2">Team</th>
            <th className="pb-2">Members</th>
            <th className="pb-2">On Leave</th>
          </tr>
        </thead>
        <tbody>
          {[
            { team: 'Engineering', members: 12, onLeave: 2 },
            { team: 'Design', members: 5, onLeave: 1 },
            { team: 'Marketing', members: 8, onLeave: 0 },
            { team: 'Sales', members: 10, onLeave: 3 },
          ].map((row, i) => (
            <tr key={i} className="border-b border-gray-100">
              <td className="py-2 font-medium">{row.team}</td>
              <td className="py-2">{row.members}</td>
              <td className="py-2">
                <span className={row.onLeave > 0 ? 'text-yellow-600' : 'text-green-600'}>
                  {row.onLeave}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  const [layout, setLayout] = useState<Layout[]>([
    { i: 'stats', x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
    { i: 'piechart', x: 2, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
    { i: 'heatmap', x: 4, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
    { i: 'upcoming', x: 0, y: 2, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'team', x: 3, y: 2, w: 3, h: 2, minW: 2, minH: 2 },
  ]);

  const widgetComponents: Record<string, React.FC> = {
    stats: StatsWidget,
    piechart: PieChartWidget,
    heatmap: HeatmapWidget,
    upcoming: UpcomingLeavesWidget,
    team: TeamOverviewWidget,
  };

  const handleLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
  };

  return (
    <PageLayout
      title="Dashboard"
      description="Drag widgets to rearrange"
      isLoading={false}
      hasError={false}
      isEmpty={false}
    >
      {/* Grid Layout */}
      <div className="bg-gray-100 rounded-lg p-4 min-h-[500px]">
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: layout }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 6, md: 4, sm: 3, xs: 2, xxs: 1 }}
          rowHeight={100}
          onLayoutChange={handleLayoutChange}
          draggableHandle=".widget-drag-handle"
          isResizable={true}
          resizeHandles={['se']}
        >
          {layout.map((item) => {
            const WidgetComponent = widgetComponents[item.i];
            return (
              <div
                key={item.i}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="widget-drag-handle bg-gray-50 px-3 py-2 border-b border-gray-200 cursor-move flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                  </svg>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Drag to move</span>
                </div>
                <div className="p-3 h-[calc(100%-36px)]">
                  {WidgetComponent && <WidgetComponent />}
                </div>
              </div>
            );
          })}
        </ResponsiveGridLayout>
      </div>
    </PageLayout>
  );
};

export default DashboardPage;


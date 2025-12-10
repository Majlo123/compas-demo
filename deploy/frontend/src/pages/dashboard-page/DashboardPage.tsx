import React, { useState } from 'react';
import { Layout } from 'react-grid-layout';
import PageLayout from '@/components/layout/PageLayout';
import { BarChart3, PieChart, Calendar, Users, TrendingUp, UserX } from 'lucide-react';
import DashboardGrid, { GridLayoutItem, WidgetRegistry } from '@/components/dashboard/DashboardGrid';
import { WidgetComponentProps } from '@/components/dashboard/WidgetRenderer';
import DialogAddWidget, { WidgetType } from '@/components/dialog/DialogAddWidget';
import Button from '@/components/controls/button/Button';
import AbsentTodayWidget from '@/components/dashboard/widgets/AbsentTodayWidget';

// Widget type definitions

const widgetTypes: WidgetType[] = [
  {
    id: 'stats',
    name: 'Quick Stats',
    description: 'View your vacation days summary at a glance',
    icon: <BarChart3 className="w-8 h-8 text-primary" />,
    defaultSize: { w: 2, h: 2 },
    minSize: { w: 2, h: 2 },
  },
  {
    id: 'piechart',
    name: 'Leave Types Distribution',
    description: 'Visual breakdown of different leave types',
    icon: <PieChart className="w-8 h-8 text-blue-500" />,
    defaultSize: { w: 2, h: 2 },
    minSize: { w: 2, h: 2 },
  },
  {
    id: 'heatmap',
    name: 'Leave Request Heatmap',
    description: 'Calendar view showing leave patterns',
    icon: <Calendar className="w-8 h-8 text-green-500" />,
    defaultSize: { w: 2, h: 2 },
    minSize: { w: 2, h: 2 },
  },
  {
    id: 'upcoming',
    name: 'Upcoming Leaves',
    description: 'List of upcoming team member leaves',
    icon: <TrendingUp className="w-8 h-8 text-yellow-500" />,
    defaultSize: { w: 3, h: 2 },
    minSize: { w: 2, h: 2 },
  },
  {
    id: 'team',
    name: 'Team Overview',
    description: 'Summary of team members and their leave status',
    icon: <Users className="w-8 h-8 text-purple-500" />,
    defaultSize: { w: 3, h: 2 },
    minSize: { w: 2, h: 2 },
  },
  {
    id: 'absent',
    name: 'People Absent Today',
    description: 'View who is on approved leave today',
    icon: <UserX className="w-8 h-8 text-orange-500" />,
    defaultSize: { w: 2, h: 2 },
    minSize: { w: 2, h: 2 },
  },
];

// Sample widget components
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

const PieChartWidget: React.FC<WidgetComponentProps> = () => (
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

const StatsWidget: React.FC<WidgetComponentProps> = () => (
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

const UpcomingLeavesWidget: React.FC<WidgetComponentProps> = () => (
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

const TeamOverviewWidget: React.FC<WidgetComponentProps> = () => (
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
  // Widget Registry - Maps widget types to their components
  const widgetRegistry: WidgetRegistry = {
    stats: StatsWidget,
    piechart: PieChartWidget,
    heatmap: HeatmapWidget,
    upcoming: UpcomingLeavesWidget,
    team: TeamOverviewWidget,
    absent: AbsentTodayWidget,
  };

  const [layouts, setLayouts] = useState<GridLayoutItem[]>([
    {
      i: 'stats',
      x: 0,
      y: 0,
      w: 2,
      h: 2,
      minW: 2,
      minH: 2,
      widgetConfig: { id: 'stats', type: 'stats' },
    },
    {
      i: 'piechart',
      x: 2,
      y: 0,
      w: 2,
      h: 2,
      minW: 2,
      minH: 2,
      widgetConfig: { id: 'piechart', type: 'piechart' },
    },
    {
      i: 'heatmap',
      x: 4,
      y: 0,
      w: 2,
      h: 2,
      minW: 2,
      minH: 2,
      widgetConfig: { id: 'heatmap', type: 'heatmap' },
    },
    {
      i: 'upcoming',
      x: 0,
      y: 2,
      w: 3,
      h: 2,
      minW: 2,
      minH: 2,
      widgetConfig: { id: 'upcoming', type: 'upcoming' },
    },
    {
      i: 'team',
      x: 3,
      y: 2,
      w: 3,
      h: 2,
      minW: 2,
      minH: 2,
      widgetConfig: { id: 'team', type: 'team' },
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLayoutChange = (newLayout: Layout[]) => {
    // Merge new layout positions with existing widget configs
    const updatedLayouts = newLayout.map((layoutItem) => {
      const existingItem = layouts.find((item) => item.i === layoutItem.i);
      return {
        ...layoutItem,
        widgetConfig: existingItem?.widgetConfig || { id: layoutItem.i, type: layoutItem.i },
      } as GridLayoutItem;
    });
    setLayouts(updatedLayouts);
  };

  const handleAddWidget = (widgetType: WidgetType) => {
    // Find the bottom-most position in the layout
    const maxY = layouts.length > 0 ? Math.max(...layouts.map((item) => item.y + item.h)) : 0;

    // Generate unique ID for this widget instance
    const existingCount = layouts.filter((item) => item.i.startsWith(widgetType.id)).length;
    const newId = existingCount > 0 ? `${widgetType.id}-${existingCount + 1}` : widgetType.id;

    const newWidget: GridLayoutItem = {
      i: newId,
      x: 0,
      y: maxY,
      w: widgetType.defaultSize.w,
      h: widgetType.defaultSize.h,
      minW: widgetType.minSize.w,
      minH: widgetType.minSize.h,
      widgetConfig: {
        id: newId,
        type: widgetType.id,
      },
    };

    setLayouts([...layouts, newWidget]);
  };

  const handleRemoveWidget = (widgetId: string) => {
    setLayouts(layouts.filter((item) => item.i !== widgetId));
  };

  return (
    <PageLayout
      title="Dashboard"
      description="Drag widgets to rearrange"
      action={
        <Button
          onClick={() => setIsModalOpen(true)}
          className="text-lg font-medium"
        >
          + Add Widget
        </Button>
      }
      actionPosition="inline"
      isLoading={false}
      hasError={false}
      isEmpty={false}
    >
      {/* Dashboard Grid */}
      <DashboardGrid
        layouts={layouts}
        widgetRegistry={widgetRegistry}
        onLayoutChange={handleLayoutChange}
        onRemoveWidget={handleRemoveWidget}
        enableRemove={true}
        enableDrag={true}
        enableResize={true}
        rowHeight={100}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 6, md: 4, sm: 3, xs: 2, xxs: 1 }}
      />

      {/* Add Widget Dialog */}
      <DialogAddWidget
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddWidget={handleAddWidget}
        existingWidgets={layouts.map((item) => item.i.split('-')[0])}
        widgetTypes={widgetTypes}
      />
    </PageLayout>
  );
};

export default DashboardPage;


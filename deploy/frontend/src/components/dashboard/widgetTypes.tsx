import { BarChart3, Calendar, PieChart, TrendingUp, Users, UserX } from 'lucide-react';
import { WidgetType } from '@/components/dialog/DialogAddWidget';

export const widgetTypes: WidgetType[] = [
  {
    id: 'time_off',
    name: 'Time Off This Month',
    description: 'Total approved leave days and breakdown by leave type',
    icon: <BarChart3 className="w-8 h-8 text-primary" />,
    defaultSize: { w: 2, h: 2 },
    minSize: { w: 1, h: 2 },
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
    name: 'Upcoming Leave Requests',
    description: 'Upcoming approved leave requests for next week or month',
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

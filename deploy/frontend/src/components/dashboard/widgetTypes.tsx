import { BarChart3, TrendingUp, UserX, Flame, AlertCircle } from 'lucide-react';
import { WidgetType } from '@/components/dialog/DialogAddWidget';

export const widgetTypes: WidgetType[] = [
  {
    id: 'time_off',
    name: 'Times Off',
    description: 'Total approved leave days and breakdown by leave type',
    icon: <BarChart3 className="w-8 h-8 text-primary" />,
    defaultSize: { w: 2, h: 2 },
    minSize: { w: 1, h: 2 },
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
    id: 'absent',
    name: 'People Absent Today',
    description: 'View who is on approved leave today',
    icon: <UserX className="w-8 h-8 text-orange-500" />,
    defaultSize: { w: 2, h: 2 },
    minSize: { w: 2, h: 2 },
  },
  {
    id: 'hot_spots',
    name: 'Hot Spots',
    description: 'Highlight days with multiple absences or potential staffing issues',
    icon: <Flame className="w-8 h-8 text-red-500" />,
    defaultSize: { w: 4, h: 3 },
    minSize: { w: 3, h: 3 },
  },
  {
    id: 'approaching_leave_limit',
    name: 'Approaching Leave Limit',
    description: 'Show employees with low remaining leave balance',
    icon: <AlertCircle className="w-8 h-8 text-amber-500" />,
    defaultSize: { w: 2, h: 2 },
    minSize: { w: 2, h: 2 },
  },
];

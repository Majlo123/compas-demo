export type Widget = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  userId: string;
  type: string;
  createdAt?: string;
  updatedAt?: string;
};

// When creating a widget the `userId` is supplied via the URL path, not the body
export type CreateWidgetData = Omit<Widget, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;

export type WidgetLayoutItem = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type WidgetListResponse = {
  data: Widget[];
};

export type SaveWidgetsLayoutRequest = {
  widgets: WidgetLayoutItem[];
};

export type TimeOffBreakdown = {
  type: string;
  days: number;
};

export type TimeOffSummary = {
  totalDays: number;
  breakdown: TimeOffBreakdown[];
};

export type UpcomingLeave = {
  id: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
};

export type UpcomingVacations = {
  total: number;
  leaves: UpcomingLeave[];
};

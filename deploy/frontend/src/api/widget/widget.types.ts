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

export type WidgetListResponse = Widget[];

export type SaveWidgetsLayoutRequest = {
  widgets: WidgetLayoutItem[];
};

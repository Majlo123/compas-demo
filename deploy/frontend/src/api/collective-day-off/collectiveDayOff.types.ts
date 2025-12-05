export interface CollectiveDayOff {
  id: string;
  startDate: string;
  endDate: string;
  description: string;
  createdAt?: string;
}

export interface CreateCollectiveDayOffRequest {
  startDate: string;
  endDate: string;
  description: string;
}

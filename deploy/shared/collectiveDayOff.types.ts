export type CollectiveDayOff = {
  id: string;
  startDate: string;
  endDate: string;
  description: string;
  createdAt?: string;
};

export type CreateCollectiveDayOffRequest = {
  startDate: string;
  endDate: string;
  description: string;
};

export type Client = {
  id: string;
  name: string;
  hourlyRate: number;
  projectCount?: number;
};

export type CreateClientData = {
  name: string;
  hourlyRate: number;
};

export type UpdateClientData = {
  name: string;
  hourlyRate: number;
};

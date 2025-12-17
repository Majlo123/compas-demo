export type Client = {
  id: string;
  name: string;
  hourlyRate: number;
  projectCount?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type CreateClientData = {
  name: string;
  hourlyRate: number;
};

export type UpdateClientData = {
  name: string;
  hourlyRate: number;
};

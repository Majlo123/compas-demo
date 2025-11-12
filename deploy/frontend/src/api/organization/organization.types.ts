import { BaseModel } from '@/api/shared.types';

export type Organization = {
  name: string;
  domain?: string;
  address?: string;
  email: string;
  phone?: string;
};

export type OrganizationCreate = Organization;

export type OrganizationResponse = Organization & BaseModel;

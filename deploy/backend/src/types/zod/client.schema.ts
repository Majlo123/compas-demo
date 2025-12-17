import { z } from 'zod';
import { QuerySchema } from 'types/zod/shared.schema';

export const ClientSchema = z.object({
  id: z.string(),
  name: z.string(),
  hourlyRate: z.number(),
  projectCount: z.number().optional(),
});

export const ClientListSchema = z.object({
  data: z.array(ClientSchema),
  page: z.number().optional(),
  pageSize: z.number().optional(),
  totalItems: z.number().optional(),
  totalPages: z.number().optional(),
});

export const CreateClientBodySchema = z.object({
  name: z.string().min(1, 'Client name is required'),
  hourlyRate: z.number().positive('Hourly rate must be greater than 0'),
});

export const UpdateClientBodySchema = z.object({
  name: z.string().min(1, 'Client name is required'),
  hourlyRate: z.number().positive('Hourly rate must be greater than 0'),
});

export const ClientsQuerySchema = QuerySchema.optional();

import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { z } from 'zod';
import { PaginatedResponseSchema } from './shared.schema';

extendZodWithOpenApi(z);

export const LeaveRequestStatusEnum = z.enum(['approved', 'pending', 'declined']);
export const LeaveRequestTypeEnum = z.enum(['vacation', 'sick', 'personal', 'other']);

export const LeaveRequestSchema = z.object({
  id: z.string().uuid(),
  type: LeaveRequestTypeEnum,
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: LeaveRequestStatusEnum,
  reason: z.string().optional(),
  createdAt: z.string().datetime(),
});

export const LeaveRequestListSchema = z.array(LeaveRequestSchema);

export const LeaveRequestSuccessSchema = z.object({
  success: z.literal(true),
  content: LeaveRequestListSchema,
});

export const PaginatedLeaveRequestSuccessSchema = PaginatedResponseSchema(LeaveRequestSchema);

export type LeaveRequestType = z.infer<typeof LeaveRequestSchema>;

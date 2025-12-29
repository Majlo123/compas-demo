import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const TimeEntrySchema = z.object({
  id: z.string().uuid().openapi({ description: 'Unique identifier for the time entry' }),
  userId: z.string().uuid().openapi({ description: 'User ID who created this entry' }),
  projectName: z.string().min(1).openapi({
    description: 'Name of the project',
    example: 'Website Redesign',
  }),
  description: z.string().optional().nullable().openapi({
    description: 'Description of work done',
    example: 'Worked on frontend components and responsive design',
  }),
  startTime: z.string().datetime().openapi({
    description: 'Start time of the work (ISO 8601 timestamp)',
    example: '2025-12-16T08:00:00.000Z',
  }),
  endTime: z.string().datetime().openapi({
    description: 'End time of the work (ISO 8601 timestamp)',
    example: '2025-12-16T10:00:00.000Z',
  }),
  isOvertime: z.boolean().openapi({
    description: 'Whether this entry is overtime',
    example: false,
  }),
  isBillable: z.boolean().openapi({
    description: 'Whether this entry is billable',
    example: true,
  }),
  createdAt: z.string().datetime().optional().openapi({ description: 'Creation timestamp' }),
  updatedAt: z.string().datetime().optional().openapi({ description: 'Last update timestamp' }),
});

export const CreateTimeEntryBodySchema = z.object({
  projectName: z.string().min(1, 'Project name is required').openapi({
    description: 'Name of the project',
    example: 'Website Redesign',
  }),
  description: z.string().optional().openapi({
    description: 'Description of work done',
    example: 'Worked on frontend components and responsive design',
  }),
  startTime: z.string().datetime('Invalid datetime format (ISO 8601)').openapi({
    description: 'Start time of work (ISO 8601 timestamp)',
    example: '2025-12-16T08:00:00.000Z',
  }),
  endTime: z.string().datetime('Invalid datetime format (ISO 8601)').openapi({
    description: 'End time of work (ISO 8601 timestamp)',
    example: '2025-12-16T10:00:00.000Z',
  }),
  isOvertime: z.boolean().optional().default(false).openapi({
    description: 'Whether this entry is overtime',
    example: false,
  }),
  isBillable: z.boolean().optional().default(true).openapi({
    description: 'Whether this entry is billable',
    example: true,
  }),
});

export const UpdateTimeEntryBodySchema = z.object({
  projectName: z.string().min(1).optional().openapi({
    description: 'Name of the project',
    example: 'Mobile App Development',
  }),
  description: z.string().optional().openapi({
    description: 'Description of work done',
    example: 'Updated API integration',
  }),
  startTime: z.string().datetime('Invalid datetime format (ISO 8601)').optional().openapi({
    description: 'Start time of work (ISO 8601 timestamp)',
    example: '2025-12-16T09:00:00.000Z',
  }),
  endTime: z.string().datetime('Invalid datetime format (ISO 8601)').optional().openapi({
    description: 'End time of work (ISO 8601 timestamp)',
    example: '2025-12-16T12:00:00.000Z',
  }),
  isOvertime: z.boolean().optional().openapi({
    description: 'Whether this entry is overtime',
    example: true,
  }),
  isBillable: z.boolean().optional().openapi({
    description: 'Whether this entry is billable',
    example: false,
  }),
});

export const TimeEntryListSchema = z.array(TimeEntrySchema);

export const TimeEntrySuccessSchema = z.object({
  success: z.literal(true),
  content: TimeEntrySchema,
});

export const TimeEntryListSuccessSchema = z.object({
  success: z.literal(true),
  content: TimeEntryListSchema,
});

export type TimeEntry = z.infer<typeof TimeEntrySchema>;
export type CreateTimeEntryBody = z.infer<typeof CreateTimeEntryBodySchema>;
export type UpdateTimeEntryBody = z.infer<typeof UpdateTimeEntryBodySchema>;

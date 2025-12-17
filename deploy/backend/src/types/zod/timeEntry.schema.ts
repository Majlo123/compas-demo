import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const TimeEntrySchema = z.object({
  id: z.string().uuid().openapi({ description: 'Unique identifier for the time entry' }),
  userId: z.string().uuid().openapi({ description: 'User ID who created this entry' }),
  projectName: z.string().min(1).openapi({ 
    description: 'Name of the project',
    example: 'Website Redesign'
  }),
  description: z.string().optional().nullable().openapi({ 
    description: 'Description of work done',
    example: 'Worked on frontend components and responsive design'
  }),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).openapi({ 
    description: 'Date of the time entry (YYYY-MM-DD)',
    example: '2025-12-16'
  }),
  timeSpentMinutes: z.number().int().positive().openapi({ 
    description: 'Time spent in minutes (max 480 = 8 hours)',
    example: 120
  }),
  isOvertime: z.boolean().openapi({ 
    description: 'Whether this entry is overtime',
    example: false
  }),
  createdAt: z.string().datetime().optional().openapi({ description: 'Creation timestamp' }),
});

export const CreateTimeEntryBodySchema = z.object({
  projectName: z.string().min(1, 'Project name is required').openapi({ 
    description: 'Name of the project',
    example: 'Website Redesign'
  }),
  description: z.string().optional().openapi({ 
    description: 'Description of work done',
    example: 'Worked on frontend components and responsive design'
  }),
  startDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
    .openapi({ 
      description: 'Date of the time entry (YYYY-MM-DD)',
      example: '2025-12-16'
    }),
  timeSpentMinutes: z.number()
    .int('Must be an integer')
    .positive('Time spent must be positive')
    .max(480, 'Cannot exceed 480 minutes (8 hours)')
    .openapi({ 
      description: 'Time spent in minutes',
      example: 120
    }),
  isOvertime: z.boolean().optional().default(false).openapi({ 
    description: 'Whether this entry is overtime',
    example: false
  }),
  isBillable: z.boolean().optional().default(true).openapi({ 
    description: 'Whether this entry is billable',
    example: true
  }),
});

export const UpdateTimeEntryBodySchema = z.object({
  projectName: z.string().min(1).optional().openapi({ 
    description: 'Name of the project',
    example: 'Mobile App Development'
  }),
  description: z.string().optional().openapi({ 
    description: 'Description of work done',
    example: 'Updated API integration'
  }),
  timeSpentMinutes: z.number()
    .int('Must be an integer')
    .positive('Time spent must be positive')
    .max(480)
    .optional()
    .openapi({ 
      description: 'Time spent in minutes',
      example: 180
    }),
  isOvertime: z.boolean().optional().openapi({ 
    description: 'Whether this entry is overtime',
    example: true
  }),
  isBillable: z.boolean().optional().openapi({ 
    description: 'Whether this entry is billable',
    example: false
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

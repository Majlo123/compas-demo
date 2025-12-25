import { z } from 'zod';

export const ParLevelSchema = z.object({
  prodId: z.string().min(1, 'Product ID is required'),
  threshold: z
    .number()
    .int('Threshold must be an integer')
    .nonnegative('Threshold must be non-negative'),
  warningLevelId: z.string().uuid('Warning level ID must be a valid UUID'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreateParLevelSchema = z.object({
  prodId: z.string().min(1, 'Product ID is required'),
  threshold: z
    .number()
    .int('Threshold must be an integer')
    .nonnegative('Threshold must be non-negative'),
  warningLevelId: z.string().uuid('Warning level ID must be a valid UUID'),
});

export const UpdateParLevelSchema = z.object({
  threshold: z
    .number()
    .int('Threshold must be an integer')
    .nonnegative('Threshold must be non-negative')
    .optional(),
  warningLevelId: z.string().uuid('Warning level ID must be a valid UUID').optional(),
});

export const GetParLevelResponseSchema = z.object({
  success: z.boolean(),
  content: z.union([ParLevelSchema, z.array(ParLevelSchema)]),
});

export const CreateParLevelResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  content: ParLevelSchema,
});

export type ParLevel = z.infer<typeof ParLevelSchema>;
export type CreateParLevel = z.infer<typeof CreateParLevelSchema>;
export type UpdateParLevel = z.infer<typeof UpdateParLevelSchema>;
export type GetParLevelResponse = z.infer<typeof GetParLevelResponseSchema>;
export type CreateParLevelResponse = z.infer<typeof CreateParLevelResponseSchema>;

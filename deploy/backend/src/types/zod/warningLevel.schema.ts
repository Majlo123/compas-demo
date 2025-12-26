import { z } from 'zod';

export const WarningLevelSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Extended schema including productCount for list responses
export const WarningLevelWithCountSchema = WarningLevelSchema.extend({
  productCount: z.number().int().nonnegative(),
});

export const CreateWarningLevelSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  description: z.string().optional().nullable(),
});

export const UpdateWarningLevelSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional().nullable(),
});

export const SearchWarningLevelResponseSchema = z.object({
  success: z.boolean(),
  content: z.array(WarningLevelSchema),
});

export const SearchWarningLevelWithCountResponseSchema = z.object({
  success: z.boolean(),
  content: z.array(WarningLevelWithCountSchema),
});

export const GetWarningLevelResponseSchema = z.object({
  success: z.boolean(),
  content: WarningLevelSchema,
});

export const CreateWarningLevelResponseSchema = z.object({
  success: z.boolean(),
  content: WarningLevelSchema,
});

export type WarningLevel = z.infer<typeof WarningLevelSchema>;
export type WarningLevelWithCount = z.infer<typeof WarningLevelWithCountSchema>;
export type CreateWarningLevel = z.infer<typeof CreateWarningLevelSchema>;
export type UpdateWarningLevel = z.infer<typeof UpdateWarningLevelSchema>;
export type SearchWarningLevelResponse = z.infer<typeof SearchWarningLevelResponseSchema>;
export type SearchWarningLevelWithCountResponse = z.infer<typeof SearchWarningLevelWithCountResponseSchema>;

import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'Password must have at least 8 characters')
  .max(100, 'Password must not have more than 100 characters')
  .refine((value) => /[a-z]/.test(value), {
    message: 'Password must have a least 1 lowercase letter',
  })
  .refine((value) => /[A-Z]/.test(value), {
    message: 'Password must have at least 1 uppercase letter',
  })
  .refine((value) => /\d/.test(value), {
    message: 'Password must have at least 1 number',
  })
  .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
    message: 'Password must have at least 1 special character',
  });

export const emailSchema = z
  .string()
  .email('Please enter a valid email address (e.g. name@example.co.za).');

export const phoneSchema = z
  .string()
  .regex(
    /^(\+44\d{9,10}|0\d{9,10})$/,
    'Please enter a valid mobile number starting with 0 or +44, followed by 9 or 10 digits.'
  );

export const selectSchemaRequired = z.object({
  label: z.string(),
  value: z.string().min(1, 'Selection is required'),
});

export const addressSchema = z
  .string()
  .min(1, 'Address is required.')
  .refine(
    (val) =>
      val.split(',').filter((part) => part.trim().length > 0).length >= 4,
    'Please enter full address (Street address, city, postal code, country).'
  );

// --- Widget schemas ---
export const WidgetSchema = z.object({
  id: z.string().optional(),
  x: z.number().int().nonnegative(),
  y: z.number().int().nonnegative(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  userId: z.string(),
  type: z.string().min(1, 'Widget type is required'),
});

export const CreateWidgetSchema = WidgetSchema.omit({ id: true });

export const UpdateWidgetSchema = z.object({
  x: z.number().int().nonnegative().optional(),
  y: z.number().int().nonnegative().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  type: z.string().min(1, 'Widget type is required').optional(),
});

export const WidgetLayoutItemSchema = z.object({
  id: z.string(),
  x: z.number().int().nonnegative(),
  y: z.number().int().nonnegative(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const SaveWidgetsLayoutSchema = z.object({
  widgets: z.array(WidgetLayoutItemSchema).min(1, 'widgets array is required'),
});

export type WidgetType = z.infer<typeof WidgetSchema>;
export type CreateWidgetType = z.infer<typeof CreateWidgetSchema>;
export type UpdateWidgetType = z.infer<typeof UpdateWidgetSchema>;
export type WidgetLayoutItemType = z.infer<typeof WidgetLayoutItemSchema>;

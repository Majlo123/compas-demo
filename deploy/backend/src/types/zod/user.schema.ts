import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string(),
  email: z.string().email(),
});

export const SearchUsersResponseSchema = z.object({
  success: z.boolean(),
  content: z.array(UserSchema),
});

export type UserType = z.infer<typeof UserSchema>;
export type SearchUsersResponse = z.infer<typeof SearchUsersResponseSchema>;

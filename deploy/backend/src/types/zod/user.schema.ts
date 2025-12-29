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

export const InviteUsersBodySchema = z.object({
  emails: z.array(z.string().email()),
});

export const InviteUsersResponseSchema = z.object({
  success: z.boolean(),
  content: z.object({
    invited: z.array(
      z.object({
        email: z.string(),
        inviteId: z.string(),
      }),
    ),
    failed: z.array(
      z.object({
        email: z.string(),
        reason: z.string(),
      }),
    ),
  }),
});

export type UserType = z.infer<typeof UserSchema>;
export type SearchUsersResponse = z.infer<typeof SearchUsersResponseSchema>;

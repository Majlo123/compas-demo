import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const CreateUserInviteBodySchema = z
  .object({
    email: z.string().email('Invalid email address'),
  })
  .openapi({
    description: 'Request body for creating a user invite',
    example: {
      email: 'user@example.com',
    },
  });

export const CreateUserInviteSuccessSchema = z.object({
  success: z.literal(true),
  content: z.object({
    inviteId: z.string().uuid(),
    token: z.string(),
    email: z.string().email(),
    expiresAt: z.string().datetime(),
  }),
  message: z.string(),
});

export type CreateUserInviteBodyType = z.infer<typeof CreateUserInviteBodySchema>;

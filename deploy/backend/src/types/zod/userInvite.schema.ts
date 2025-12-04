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

export const VerifyInviteBodySchema = z
  .object({
    token: z.string(),
  })
  .openapi({
    description: 'Request body for verifying an invite token',
    example: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  });

export const VerifyInviteSuccessSchema = z.object({
  success: z.literal(true),
  content: z.object({
    email: z.string().email(),
  }),
});

export type CreateUserInviteBodyType = z.infer<typeof CreateUserInviteBodySchema>;

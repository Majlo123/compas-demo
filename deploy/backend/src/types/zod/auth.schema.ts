import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

// Login request schema
export const LoginSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  })
  .openapi({
    description: 'Request body for user login',
    example: {
      email: 'user@example.com',
      password: 'password123',
    },
  });

// Login success response schema
export const LoginSuccessSchema = z
  .object({
    success: z.boolean(),
    content: z.object({
      token: z.string(),
      user: z.object({
        id: z.string(),
        email: z.string().email(),
        fullName: z.string(),
      }),
    }),
  })
  .openapi({
    description: 'Successful login response with JWT token and user data',
    example: {
      success: true,
      content: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'user@example.com',
          fullName: 'John Doe',
        },
      },
    },
  });

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

// Register request schema
export const RegisterSchema = z
  .object({
    fullName: z
      .string()
      .min(3, 'Full name must be at least 3 characters')
      .regex(
        /^[A-Za-z]+(?:[ '\-][A-Za-z]+)*$/,
        'Name should contain only letters, spaces, hyphens or apostrophes',
      ),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  })
  .openapi({
    description: 'Request body for user registration',
    example: {
      fullName: 'John Doe',
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

// Change password request schema
export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .openapi({
    description: 'Request body for changing password',
    example: {
      currentPassword: 'oldPassword123',
      newPassword: 'newPassword123',
      confirmPassword: 'newPassword123',
    },
  });

// Change password success response schema
export const ChangePasswordSuccessSchema = z
  .object({
    success: z.boolean(),
    message: z.string(),
    content: z.object({
      success: z.boolean(),
      message: z.string(),
    }),
  })
  .openapi({
    description: 'Successful password change response',
    example: {
      success: true,
      message: 'Password changed successfully',
      content: {
        success: true,
        message: 'Password changed successfully',
      },
    },
  });

import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

const FilterOperatorEnum = z.enum([
  'contains',
  'equals',
  'lessThan',
  'greaterThan',
  'startsWith',
  'endsWith',
]);

const FilterSchema = z.object({
  filterKey: z.string(),
  operator: FilterOperatorEnum,
  value: z.union([z.string(), z.number(), z.boolean()]),
});

export const QuerySchema = z
  .object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .refine((val) => val > 0, { message: 'Page must be a positive integer' }),
    pageSize: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 20))
      .refine((val) => val > 0, { message: 'Page size must be a positive integer' }),
    by: z.string().optional(),
    direction: z.enum(['asc', 'desc']).optional().default('asc'),
    filter: z
      .string()
      .transform((val, ctx) => {
        try {
          const decoded = decodeURIComponent(val);
          const parsed = JSON.parse(decoded);
          if (!Array.isArray(parsed)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: '"filter" must be a JSON array',
            });
            return z.NEVER;
          }
          parsed.forEach((f, i) => {
            const result = FilterSchema.safeParse(f);
            if (!result.success) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Invalid filter at index ${i}: ${result.error.message}`,
              });
            }
          });

          return parsed;
        } catch (err) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Invalid JSON format for "filter"',
          });
          return z.NEVER;
        }
      })
      .optional(),
  })
  .openapi({
    description: 'Query parameters for pagination, sorting, and filtering',
    example: {
      page: '1',
      pageSize: '10',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      filters: JSON.stringify([
        { filterKey: 'status', operator: 'equals', value: 'active' },
        { filterKey: 'age', operator: 'greaterThan', value: '30' },
      ]),
    },
  });

export const BaseResponseSchema = z
  .object({
    success: z.boolean(),
    message: z.string().optional(),
  })
  .openapi({
    description: 'Base response indicating success/failure and an optional message.',
    example: {
      success: true,
      message: 'Operation completed successfully',
    },
  });

export const ContentResponseSchema = <T extends z.ZodTypeAny>(
  contentSchema: T,
): typeof BaseResponseSchema =>
  BaseResponseSchema.extend({
    content: contentSchema,
  });

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(
  itemSchema: T,
): typeof BaseResponseSchema =>
  BaseResponseSchema.extend({
    content: z.object({
      data: z.array(itemSchema),
      page: z.number().int().min(1),
      pageSize: z.number().int().min(1),
      totalItems: z.number().int().min(0),
      totalPages: z.number().int().min(1),
    }),
  });

export const BaseErrorResponseSchema = z
  .object({
    success: z.literal(false),
    error: z.object({
      code: z.union([z.number(), z.string()]),
      message: z.string(),
    }),
    stack: z.string().optional(), // Only in development
  })
  .openapi({
    description:
      'Standard error response indicating failure, error details, and optional stack trace (only in development).',
    example: {
      success: false,
      error: {
        code: 500,
        message: 'An unexpected error occurred',
      },
      stack: 'Error: Something went wrong\n    at file.js:10:15',
    },
  });

const createErrorResponseSchema = (
  description: string,
  exampleMsg: string,
  code: number,
): typeof BaseErrorResponseSchema =>
  BaseErrorResponseSchema.openapi({
    description,
    example: {
      success: false,
      error: {
        code,
        message: exampleMsg,
      },
    },
  });

export const BadRequestResponseSchema = createErrorResponseSchema(
  'Bad Request',
  'Invalid input or missing required fields',
  400,
);

export const UnauthorizedResponseSchema = createErrorResponseSchema(
  'Unauthorized',
  'Token not provided or invalid',
  401,
);

export const ForbiddenResponseSchema = createErrorResponseSchema(
  'Forbidden',
  'You do not have permission to access this resource',
  403,
);

export const NotFoundResponseSchema = createErrorResponseSchema(
  'Not Found',
  'The requested resource could not be found',
  404,
);

export const InternalServerErrorSchema = createErrorResponseSchema(
  'Internal Server Error',
  'An unexpected error occurred on the server',
  500,
);

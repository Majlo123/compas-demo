import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

import ApiError from 'shared/error/ApiError';
import { lowercaseFirstLetter } from 'shared/utils/string';
import z, { ZodTypeAny } from 'zod';

export const validateObject = (
  obj: any,
  schema: ZodTypeAny,
): { valid: boolean; value?: z.infer<typeof schema>; errors?: any } => {
  try {
    const result = schema.safeParse(obj);

    if (!result.success) {
      return {
        valid: false,
        errors: result.error,
      };
    }

    return {
      valid: true,
      value: result.data,
    };
  } catch (err) {
    return {
      valid: false,
    };
  }
};

export const validateRequestBody =
  (schema: ZodTypeAny) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const validationResult = validateObject(req.body, schema);

    if (schema && validationResult?.valid !== true) {
      const firstErrorMessage = validationResult.errors?.issues?.[0]?.message || '';

      throw new ApiError(
        `Invalid Input, ${lowercaseFirstLetter(firstErrorMessage)}.`,
        httpStatus.BAD_REQUEST,
        true,
        '',
        {
          validationErrors: validationResult?.errors,
        },
      );
    }

    next();
  };

export const validateQueryParams =
  (schema: ZodTypeAny) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const validationResult = validateObject(req.query, schema);

    if (schema && validationResult?.valid !== true) {
      const firstErrorMessage = validationResult.errors?.issues?.[0]?.message || '';

      throw new ApiError(
        `Invalid Query Params, ${lowercaseFirstLetter(firstErrorMessage)}.`,
        httpStatus.BAD_REQUEST,
        true,
        '',
        {
          validationErrors: validationResult?.errors,
        },
      );
    }

    next();
  };

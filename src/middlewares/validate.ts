import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { CustomError } from '../utils/CustomError';

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!result.success) {
      const zodError: ZodError = result.error;
      const formatted = zodError.flatten();

      const details = {
        fieldErrors: formatted.fieldErrors,
        formErrors: formatted.formErrors
      };

      return next(new CustomError('Validation error', 400, details));
    }

    (req as any).validated = result.data;

    return next();
  };


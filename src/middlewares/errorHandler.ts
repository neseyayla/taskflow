import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/CustomError';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details: unknown;

  if (err instanceof CustomError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof Error) {
    message = err.message;
  }

  const isProduction = process.env.NODE_ENV === 'production';

  const payload: Record<string, unknown> = {
    message,
    statusCode
  };

  if (details) {
    payload.details = details;
  }

  if (!isProduction && err instanceof Error) {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};


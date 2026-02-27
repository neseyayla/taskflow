import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/CustomError';

export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  const error = new CustomError(`Route ${req.method} ${req.originalUrl} not found`, 404);
  next(error);
};


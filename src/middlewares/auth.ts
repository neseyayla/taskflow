import { Request, Response, NextFunction } from 'express';
import type { GlobalRole } from '@prisma/client';
import { verifyAccessToken } from '../utils/jwt';
import { CustomError } from '../utils/CustomError';

export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new CustomError('Authorization header missing or malformed', 401));
  }

  const token = authHeader.substring('Bearer '.length).trim();

  if (!token) {
    return next(new CustomError('Authorization token missing', 401));
  }

  try {
    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.userId,
      role: payload.role
    };

    return next();
  } catch (error) {
    return next(error);
  }
};

export const requireRole =
  (...roles: GlobalRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new CustomError('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new CustomError('Forbidden', 403));
    }

    return next();
  };



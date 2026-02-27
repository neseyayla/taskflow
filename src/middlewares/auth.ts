import { Request, Response, NextFunction } from 'express';
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


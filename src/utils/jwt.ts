import jwt, { type SignOptions, type Secret } from 'jsonwebtoken';
import type { GlobalRole } from '@prisma/client';
import { CustomError } from './CustomError';

export interface AccessTokenPayload {
  userId: string;
  role: GlobalRole;
}

const getAccessSecret = (): string => {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET is not configured');
  }

  return secret;
};

const getAccessExpiresIn = (): string | number => {
  return process.env.JWT_ACCESS_EXPIRES_IN ?? '15m';
};

export const signAccessToken = (payload: AccessTokenPayload): string => {
  try {
    const secret: Secret = getAccessSecret();
    const options: SignOptions = {
      expiresIn: getAccessExpiresIn() as any
    };

    return jwt.sign(payload, secret, options);
  } catch (error) {
    throw new CustomError('Failed to sign access token', 500);
  }
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  try {
    return jwt.verify(token, getAccessSecret()) as AccessTokenPayload;
  } catch {
    throw new CustomError('Invalid or expired token', 401);
  }
};


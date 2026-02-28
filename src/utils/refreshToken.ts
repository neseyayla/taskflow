import crypto from 'crypto';

export const generateRefreshToken = (): string => {
  return crypto.randomBytes(64).toString('hex');
};

export const hashRefreshToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const getRefreshTokenExpiryDate = (): Date => {
  const rawTtl = process.env.REFRESH_TOKEN_TTL_DAYS;
  const parsedTtl = rawTtl ? Number(rawTtl) : NaN;
  const ttlDays = !Number.isNaN(parsedTtl) && parsedTtl > 0 ? parsedTtl : 7;

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + ttlDays);

  return expiresAt;
};


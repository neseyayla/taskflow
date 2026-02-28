import bcrypt from 'bcrypt';
import type { User } from '@prisma/client';
import { userRepository, toSafeUser } from '../repositories/user.repo';
import { CustomError } from '../utils/CustomError';
import { signAccessToken } from '../utils/jwt';
import type { RegisterBody, LoginBody, RefreshBody, LogoutBody } from '../schemas/auth.schema';
import { refreshTokenRepository } from '../repositories/refreshToken.repo';
import { generateRefreshToken, getRefreshTokenExpiryDate, hashRefreshToken } from '../utils/refreshToken';

const getSaltRounds = (): number => {
  const raw = process.env.BCRYPT_SALT_ROUNDS;

  if (!raw) {
    return 10;
  }

  const parsed = Number(raw);

  if (Number.isNaN(parsed) || parsed <= 0) {
    return 10;
  }

  return parsed;
};

const issueTokensForUser = async (user: User) => {
  const accessToken = signAccessToken({
    userId: user.id,
    role: user.role
  });

  const refreshToken = generateRefreshToken();
  const tokenHash = hashRefreshToken(refreshToken);
  const expiresAt = getRefreshTokenExpiryDate();

  await refreshTokenRepository.create({
    userId: user.id,
    tokenHash,
    expiresAt
  });

  return {
    user: toSafeUser(user),
    accessToken,
    refreshToken
  };
};

export const register = async (payload: RegisterBody) => {
  const existing = await userRepository.findByEmail(payload.email);

  if (existing) {
    throw new CustomError('Email is already in use', 409);
  }

  const saltRounds = getSaltRounds();
  const hashedPassword = await bcrypt.hash(payload.password, saltRounds);

  const user = await userRepository.create({
    email: payload.email,
    password: hashedPassword
  });

  return issueTokensForUser(user);
};

export const login = async (payload: LoginBody) => {
  const user = await userRepository.findByEmail(payload.email);

  if (!user) {
    throw new CustomError('Invalid email or password', 401);
  }

  const isMatch = await bcrypt.compare(payload.password, user.password);

  if (!isMatch) {
    throw new CustomError('Invalid email or password', 401);
  }

  return issueTokensForUser(user);
};

export const refresh = async (payload: RefreshBody) => {
  const tokenHash = hashRefreshToken(payload.refreshToken);
  const existing = await refreshTokenRepository.findByTokenHash(tokenHash);

  if (!existing) {
    throw new CustomError('Invalid or expired refresh token', 401);
  }

  if (existing.revoked || existing.expiresAt <= new Date()) {
    throw new CustomError('Invalid or expired refresh token', 401);
  }

  await refreshTokenRepository.revokeById(existing.id);

  return issueTokensForUser(existing.user);
};

export const logout = async (payload: LogoutBody) => {
  const tokenHash = hashRefreshToken(payload.refreshToken);

  await refreshTokenRepository.revokeByTokenHash(tokenHash);
};


import bcrypt from 'bcrypt';
import type { User } from '@prisma/client';
import { userRepository, toSafeUser } from '../repositories/user.repo';
import { CustomError } from '../utils/CustomError';
import { signAccessToken } from '../utils/jwt';
import type { RegisterBody, LoginBody } from '../schemas/auth.schema';

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

const buildAuthResponse = (user: User) => {
  const accessToken = signAccessToken({
    userId: user.id,
    role: user.role
  });

  return {
    user: toSafeUser(user),
    accessToken
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

  return buildAuthResponse(user);
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

  return buildAuthResponse(user);
};


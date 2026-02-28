import type { User } from '@prisma/client';
import { prisma } from '../config/prisma';

export const userRepository = {
  findById(id: string) {
    return prisma.user.findUnique({
      where: { id }
    });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    });
  },

  create(input: { email: string; password: string }) {
    return prisma.user.create({
      data: {
        email: input.email,
        password: input.password
      }
    });
  }
};

export const toSafeUser = (user: User) => {
  const { password, ...rest } = user;
  return rest;
};


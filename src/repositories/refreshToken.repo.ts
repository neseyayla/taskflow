import type { User } from '@prisma/client';
import { prisma } from '../config/prisma';

export interface RefreshTokenRecord {
  id: string;
  tokenHash: string;
  userId: string;
  revoked: boolean;
  expiresAt: Date;
  createdAt: Date;
  user: User;
}

export const refreshTokenRepository = {
  async create(input: { userId: string; tokenHash: string; expiresAt: Date }): Promise<void> {
    await (prisma as any).refreshToken.create({
      data: {
        userId: input.userId,
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt
      }
    });
  },

  async findByTokenHash(tokenHash: string): Promise<RefreshTokenRecord | null> {
    const record = await (prisma as any).refreshToken.findUnique({
      where: { tokenHash },
      include: {
        user: true
      }
    });

    return record as RefreshTokenRecord | null;
  },

  async revokeById(id: string): Promise<void> {
    await (prisma as any).refreshToken.update({
      where: { id },
      data: {
        revoked: true
      }
    });
  },

  async revokeByTokenHash(tokenHash: string): Promise<void> {
    const existing = await (prisma as any).refreshToken.findUnique({
      where: { tokenHash }
    });

    if (!existing) {
      return;
    }

    if (existing.revoked) {
      return;
    }

    await (prisma as any).refreshToken.update({
      where: { id: existing.id },
      data: {
        revoked: true
      }
    });
  }
};


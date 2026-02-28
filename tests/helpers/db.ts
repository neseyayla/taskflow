import { prisma } from '../../src/config/prisma';

export const resetDb = async (): Promise<void> => {
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "RefreshToken", "WorkspaceMember", "Workspace", "User" RESTART IDENTITY CASCADE;'
  );
};

export const disconnectDb = async (): Promise<void> => {
  await prisma.$disconnect();
};


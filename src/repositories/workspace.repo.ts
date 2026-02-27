import { prisma } from '../config/prisma';

export const workspaceRepository = {
  findById(id: string) {
    return prisma.workspace.findUnique({
      where: { id },
      include: {
        members: true
      }
    });
  },

  create(input: { name: string; ownerUserId: string }) {
    return prisma.workspace.create({
      data: {
        name: input.name,
        members: {
          create: {
            userId: input.ownerUserId,
            role: 'OWNER'
          }
        }
      },
      include: {
        members: true
      }
    });
  },

  addMember(workspaceId: string, userId: string) {
    return prisma.workspaceMember.upsert({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId
        }
      },
      update: {},
      create: {
        workspaceId,
        userId
      }
    });
  }
};


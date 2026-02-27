import { workspaceRepository } from '../repositories/workspace.repo';
import type { CreateWorkspaceBody } from '../schemas/workspace.schema';

export const createWorkspace = (userId: string, payload: CreateWorkspaceBody) => {
  return workspaceRepository.create({
    name: payload.name,
    ownerUserId: userId
  });
};


import { Request, Response, NextFunction } from 'express';
import type { CreateWorkspaceBody } from '../schemas/workspace.schema';
import * as workspaceService from '../services/workspace.service';
import { CustomError } from '../utils/CustomError';

export const createWorkspace = async (
  req: Request<unknown, unknown, CreateWorkspaceBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new CustomError('Authentication required', 401);
    }

    const workspace = await workspaceService.createWorkspace(req.user.id, req.body);

    res.status(201).json({ workspace });
  } catch (error) {
    next(error);
  }
};


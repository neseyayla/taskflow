import { Request, Response, NextFunction } from 'express';
import type { RegisterBody, LoginBody, RefreshBody, LogoutBody } from '../schemas/auth.schema';
import * as authService from '../services/auth.service';

export const register = async (
  req: Request<unknown, unknown, RegisterBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request<unknown, unknown, LoginBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: Request<unknown, unknown, RefreshBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.refresh(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request<unknown, unknown, LogoutBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await authService.logout(req.body);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};


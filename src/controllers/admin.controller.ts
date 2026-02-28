import { Request, Response, NextFunction } from 'express';

export const ping = async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
  res.status(200).json({ ok: true });
};


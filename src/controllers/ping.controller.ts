import { Request, Response } from 'express';
import { PingBody } from '../schemas/ping.schema';

export const getPing = (_req: Request, res: Response): void => {
  res.status(200).json({ pong: true });
};

export const postPing = (req: Request<unknown, unknown, PingBody>, res: Response): void => {
  const { message } = req.body;
  res.status(200).json({ received: message });
};


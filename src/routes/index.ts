import { Router, Request, Response } from 'express';
import pingRouter from './ping.routes';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ ok: true });
});

router.get('/api', (_req: Request, res: Response) => {
  res.status(200).json({ name: 'TaskFlow API' });
});

router.use('/api/ping', pingRouter);

export default router;


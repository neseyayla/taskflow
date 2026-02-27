import { Router, Request, Response } from 'express';
import pingRouter from './ping.routes';
import authRouter from './auth.routes';
import workspaceRouter from './workspace.routes';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ ok: true });
});

router.get('/api', (_req: Request, res: Response) => {
  res.status(200).json({ name: 'TaskFlow API' });
});

router.use('/api/ping', pingRouter);
router.use('/api/auth', authRouter);
router.use('/api/workspaces', workspaceRouter);

export default router;


import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/auth';
import { ping } from '../controllers/admin.controller';

const router = Router();

router.get('/ping', requireAuth, requireRole('ADMIN'), ping);

export default router;


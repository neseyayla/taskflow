import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createWorkspaceRequestSchema } from '../schemas/workspace.schema';
import { createWorkspace } from '../controllers/workspace.controller';

const router = Router();

router.post('/', requireAuth, validate(createWorkspaceRequestSchema), createWorkspace);

export default router;


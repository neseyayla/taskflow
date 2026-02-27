import { Router } from 'express';
import { getPing, postPing } from '../controllers/ping.controller';
import { validate } from '../middlewares/validate';
import { pingRequestSchema } from '../schemas/ping.schema';

const router = Router();

router.get('/', getPing);

router.post('/', validate(pingRequestSchema), postPing);

export default router;


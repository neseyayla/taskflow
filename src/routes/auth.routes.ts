import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { registerRequestSchema, loginRequestSchema } from '../schemas/auth.schema';
import { register, login } from '../controllers/auth.controller';

const router = Router();

router.post('/register', validate(registerRequestSchema), register);
router.post('/login', validate(loginRequestSchema), login);

export default router;


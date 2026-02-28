import { Router } from 'express';
import { validate } from '../middlewares/validate';
import {
  registerRequestSchema,
  loginRequestSchema,
  refreshRequestSchema,
  logoutRequestSchema
} from '../schemas/auth.schema';
import { register, login, refresh, logout } from '../controllers/auth.controller';

const router = Router();

router.post('/register', validate(registerRequestSchema), register);
router.post('/login', validate(loginRequestSchema), login);
router.post('/refresh', validate(refreshRequestSchema), refresh);
router.post('/logout', validate(logoutRequestSchema), logout);

export default router;


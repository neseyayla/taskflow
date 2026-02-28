import type { GlobalRole } from '@prisma/client';

declare global {
  namespace Express {
    interface AuthUser {
      id: string;
      role: GlobalRole;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};


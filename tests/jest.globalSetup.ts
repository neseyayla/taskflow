import { execSync } from 'child_process';
import dotenv from 'dotenv';

export default async (): Promise<void> => {
  dotenv.config({ path: '.env.test' });

  execSync('npx prisma migrate deploy', {
    stdio: 'inherit'
  });
};


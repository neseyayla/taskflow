import dotenv from 'dotenv';
import http from 'http';
import app from './app';

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`TaskFlow API listening on port ${PORT}`);
});


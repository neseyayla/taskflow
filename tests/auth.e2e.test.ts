import request from 'supertest';
import app from '../src/app';
import { resetDb, disconnectDb } from './helpers/db';
import { prisma } from '../src/config/prisma';

describe('Auth and protected routes', () => {
  beforeEach(async () => {
    await resetDb();
  });

  afterAll(async () => {
    await resetDb();
    await disconnectDb();
  });

  const userCredentials = {
    email: 'test.user@example.com',
    password: 'Password123!'
  };

  it('POST /api/auth/register should create a user and return accessToken and refreshToken', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(userCredentials)
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe(userCredentials.email);
  });

  it('POST /api/auth/login with correct credentials returns accessToken and refreshToken', async () => {
    await request(app).post('/api/auth/register').send(userCredentials).expect(201);

    const response = await request(app)
      .post('/api/auth/login')
      .send(userCredentials)
      .expect(200);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe(userCredentials.email);
  });

  it('POST /api/auth/login with wrong password returns 401', async () => {
    await request(app).post('/api/auth/register').send(userCredentials).expect(201);

    await request(app)
      .post('/api/auth/login')
      .send({ ...userCredentials, password: 'WrongPassword!' })
      .expect(401);
  });

  it('POST /api/workspaces without Authorization returns 401', async () => {
    await request(app)
      .post('/api/workspaces')
      .send({ name: 'My Workspace' })
      .expect(401);
  });

  it('POST /api/workspaces with Bearer token returns 201', async () => {
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(userCredentials)
      .expect(201);

    const token = registerResponse.body.accessToken as string;

    const response = await request(app)
      .post('/api/workspaces')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'My Workspace' })
      .expect(201);

    expect(response.body).toHaveProperty('workspace');
    expect(response.body.workspace.name).toBe('My Workspace');
  });

  it('POST /api/auth/refresh rotates refresh tokens and issues new access token', async () => {
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(userCredentials)
      .expect(201);

    const originalRefreshToken = registerResponse.body.refreshToken as string;

    const firstRefreshResponse = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: originalRefreshToken })
      .expect(200);

    expect(firstRefreshResponse.body).toHaveProperty('accessToken');
    expect(firstRefreshResponse.body).toHaveProperty('refreshToken');

    const newRefreshToken = firstRefreshResponse.body.refreshToken as string;

    await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: originalRefreshToken })
      .expect(401);

    const secondRefreshResponse = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: newRefreshToken })
      .expect(200);

    expect(secondRefreshResponse.body).toHaveProperty('accessToken');
    expect(secondRefreshResponse.body).toHaveProperty('refreshToken');
  });

  it('POST /api/auth/logout revokes the refresh token', async () => {
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(userCredentials)
      .expect(201);

    const refreshToken = registerResponse.body.refreshToken as string;

    await request(app)
      .post('/api/auth/logout')
      .send({ refreshToken })
      .expect(204);

    await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken })
      .expect(401);
  });

  it('GET /api/admin/ping with USER token returns 403', async () => {
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(userCredentials)
      .expect(201);

    const accessToken = registerResponse.body.accessToken as string;

    await request(app)
      .get('/api/admin/ping')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(403);
  });

  it('GET /api/admin/ping with ADMIN token returns 200', async () => {
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(userCredentials)
      .expect(201);

    await prisma.user.update({
      where: { email: userCredentials.email },
      data: { role: 'ADMIN' }
    });

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send(userCredentials)
      .expect(200);

    const adminAccessToken = loginResponse.body.accessToken as string;

    await request(app)
      .get('/api/admin/ping')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);
  });
});


import request from 'supertest';
import app from '../src/app';
import { resetDb, disconnectDb } from './helpers/db';

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

  it('POST /api/auth/register should create a user and return accessToken', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(userCredentials)
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe(userCredentials.email);
  });

  it('POST /api/auth/login with correct credentials returns accessToken', async () => {
    await request(app).post('/api/auth/register').send(userCredentials).expect(201);

    const response = await request(app)
      .post('/api/auth/login')
      .send(userCredentials)
      .expect(200);

    expect(response.body).toHaveProperty('accessToken');
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
});


import request from 'supertest';
import { app } from '../../app';

test('should return a statusCode of 201 on successful signup', async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' });

  expect(res.status).toBe(201);
});

test('should return a statusCode of 400 for invalid email', async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({ email: 'testtest.com', password: 'password' });

  expect(res.status).toBe(400);
});

test('should return a statusCode of 400 for invalid password', async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'p' });

  expect(res.status).toBe(400);
});

test('should return a statusCode of 400 for missing email or passord', async () => {
  const res1 = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com' });

  const res2 = await request(app)
    .post('/api/users/signup')
    .send({ password: 'password' });

  expect(res1.status).toBe(400);
  expect(res2.status).toBe(400);
});

test('should disallow duplicate emails', async () => {
  const res1 = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' });

  const res2 = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' });

  expect(res1.status).toBe(201);
  expect(res2.status).toBe(400);
});

test('should set a cookie on successful signup', async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' });

  expect(res.get('Set-Cookie')).toBeDefined();
});

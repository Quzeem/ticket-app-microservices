import request from 'supertest';
import { app } from '../../app';

test('should return a statusCode of 400 if there is no user with the email provided', async () => {
  const res = await request(app)
    .post('/api/users/login')
    .send({ email: 'test@test.com', password: 'password' });

  expect(res.status).toBe(400);
});

test('should return a statusCode of 400 if password is incorrect', async () => {
  const res1 = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' });

  const res2 = await request(app)
    .post('/api/users/login')
    .send({ email: 'test@test.com', password: '12345678' });

  expect(res1.status).toBe(201);
  expect(res2.status).toBe(400);
});

test('should set a cookie for a user with valid credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201);

  const res = await request(app)
    .post('/api/users/login')
    .send({ email: 'test@test.com', password: 'password' });

  expect(res.status).toBe(200);
  expect(res.get('Set-Cookie')).toBeDefined();
});

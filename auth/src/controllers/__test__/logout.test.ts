import request from 'supertest';
import { app } from '../../app';

test('should clear the cookie after a user logged out', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201);

  const res = await request(app).post('/api/users/logout').send({});

  expect(res.status).toBe(200);
  expect(res.get('Set-Cookie')).toBeDefined();
  expect(res.get('Set-Cookie')[0]).toEqual(
    'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});

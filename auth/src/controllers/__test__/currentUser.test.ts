import request from 'supertest';
import { app } from '../../app';

test('should return the details of the current user', async () => {
  const cookie = await global.signup();

  const res = await request(app)
    .get('/api/users/current-user')
    .set('Cookie', cookie)
    .send({});

  expect(res.status).toBe(200);
  expect(res.body.data.email).toEqual('test@test.com');
});

test('should return null if user is not authenticated', async () => {
  const res = await request(app).get('/api/users/current-user').send({});

  expect(res.status).toBe(200);
  expect(res.body.data).toEqual(null);
});

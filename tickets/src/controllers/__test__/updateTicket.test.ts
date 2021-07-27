import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

test('should return a statusCode of 404 if a ticket does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signup())
    .send({ title: 'Clubfare', price: 30 })
    .expect(404);
});

test('should only be accessible if a user is authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'Clubfare', price: 30 })
    .expect(401);
});

test('should return a statusCode than 401 if a user is authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  const res = await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signup())
    .send({ title: 'Clubfare', price: 30 });

  expect(res.status).not.toEqual(401);
});

test('should only update a ticket owned by an authenticated user', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ title: 'Fanfare', price: 20 })
    .expect(201);

  // The userId here for the currentUser is different from the one used above since it's randomly generated in global signup function
  await request(app)
    .put(`/api/tickets/${res.body.data.id}`)
    .set('Cookie', global.signup())
    .send({ title: 'Clubfare', price: 30 })
    .expect(403);
});

test('should return an error if an invalid title or price is provided', async () => {
  const cookie = global.signup();

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'Fanfare', price: 20 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${res.body.data.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: -30 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${res.body.data.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 30 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${res.body.data.id}`)
    .set('Cookie', cookie)
    .send({ title: 'Clubfare', price: -30 })
    .expect(400);
});

test('should update a ticket if valid inputs are provided', async () => {
  const cookie = global.signup();

  const res1 = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'Fanfare', price: 20 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${res1.body.data.id}`)
    .set('Cookie', cookie)
    .send({ title: 'Clubfare', price: 30 })
    .expect(200);

  const res2 = await request(app)
    .get(`/api/tickets/${res1.body.data.id}`)
    .send()
    .expect(200);

  expect(res2.body.data.title).toEqual('Clubfare');
  expect(res2.body.data.price).toEqual(30);
});

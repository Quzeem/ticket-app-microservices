import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

test('should return a statusCode of 404 if a ticket does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

test('should return a ticket data if it exists', async () => {
  const data = { title: 'Fanfare', price: 20 };

  const res1 = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send(data)
    .expect(201);

  const res2 = await request(app)
    .get(`/api/tickets/${res1.body.data.id}`)
    .send()
    .expect(200);

  expect(res2.body.data.title).toEqual(data.title);
  expect(res2.body.data.price).toEqual(data.price);
});

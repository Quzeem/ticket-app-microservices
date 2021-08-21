import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticketModel';

test('should fetch a specific user order', async () => {
  // Signup a user
  const userCookie = global.signup();

  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // Create an order
  const {
    body: { data: order },
  } = await request(app)
    .post('/api/orders')
    .set('Cookie', userCookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  // retrieve the specific order
  const {
    body: { data: fetchedOrder },
  } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', userCookie)
    .send()
    .expect(200);

  // Make assertions
  expect(fetchedOrder.id).toEqual(order.id);
});

test("should return a statusCode of 403 if a user tries to fetch another user's order", async () => {
  // Signup a user
  const userCookie = global.signup();

  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // Create an order
  const {
    body: { data: order },
  } = await request(app)
    .post('/api/orders')
    .set('Cookie', userCookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  // retrieve the specific order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signup())
    .send()
    .expect(403);
});

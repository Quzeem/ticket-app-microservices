import request from 'supertest';
import mongoose from 'mongoose'
import { app } from '../../app';
import { Ticket } from '../../models/ticketModel';
import { OrderStatus } from '../../models/orderModel';
import { natsWrapper } from '../../config/natsWrapper';

test('Should cancel a specific order for a user', async () => {
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

  // Cancel the order
  const {
    body: { data: cancelledOrder },
  } = await request(app)
    .put(`/api/orders/${order.id}`)
    .set('Cookie', userCookie)
    .send()
    .expect(200);

  // Make assertions
  expect(cancelledOrder.status).toEqual(OrderStatus.Cancelled);
});

// test.todo('emits an order cancelled event')
test('should emit an order cancelled event', async () => {
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

  // Cancel the order
  const {
    body: { data: cancelledOrder },
  } = await request(app)
    .put(`/api/orders/${order.id}`)
    .set('Cookie', userCookie)
    .send()
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

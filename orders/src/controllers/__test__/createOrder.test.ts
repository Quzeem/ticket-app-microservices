import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../models/orderModel';
import { Ticket } from '../../models/ticketModel';
import { natsWrapper } from '../../config/natsWrapper';

test('should return a statusCode of 404 if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId })
    .expect(404);
});

test('should return a statusCode of 400 if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 50,
  });
  await ticket.save();
  // console.log('Ticket:', ticket);

  const order = Order.build({
    userId: '123',
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();
  // console.log('Order:', order);

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId: ticket.id })
    .expect(400);
});

test('should reserve a ticket if everything went well', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 50,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId: ticket.id })
    .expect(201);
});

// test.todo('emits an order created event');
test('should emits an order created event', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 50,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

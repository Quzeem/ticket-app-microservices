import { OrderStatus } from '@zeetickets/lib';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/orderModel';
// import { stripe } from '../../config/stripe';
import { Payment } from '../../models/paymentModel';

test('should return a statusCode of 404 if the order does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup())
    .send({
      orderId: mongoose.Types.ObjectId().toHexString(),
      token: 'asdf',
    })
    .expect(404);
});

test('should return a statusCode of 403 if the order does not belong to the user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    price: 20,
    userId: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup())
    .send({
      orderId: order.id,
      token: 'asdf',
    })
    .expect(403);
});

test('should return a statusCode of 400 if the order has already been cancelled', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    price: 20,
    userId,
    status: OrderStatus.Cancelled,
    version: 0,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup(userId))
    .send({
      orderId: order.id,
      token: 'asdf',
    })
    .expect(400);
});

test('should return a statusCode of 201 if everything went well', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    price: 20,
    userId,
    status: OrderStatus.Created,
    version: 0,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup(userId))
    .send({
      orderId: order.id,
      token: 'tok_visa',
    })
    .expect(201);

  // Write assertions about stripe
  // const chargeOpts = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  // expect(chargeOpts.source).toEqual('tok_visa');
  // expect(chargeOpts.amount).toEqual(20 * 100);
  // expect(chargeOpts.currency).toEqual('usd');

  // Assert that the payment doc was saved in the DB
  const payment = await Payment.findOne({ orderId: order.id });
  expect(payment).not.toBeNull();
});

import { OrderCreatedEvent, OrderStatus } from '@zeetickets/lib';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../config/natsWrapper';
import { Order } from '../../../models/orderModel';
import { OrderCreatedListener } from '../orderCreatedListener';

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create a fake data object
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    expiresAt: 'asdf',
    status: OrderStatus.Created,
    version: 0,
    ticket: {
      id: mongoose.Types.ObjectId().toHexString(),
      price: 20,
    },
  };

  // Create a fake message object
  // @ts-ignore ===> we only care about the ack method
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

test('should create an order', async () => {
  const { listener, data, msg } = await setup();

  // Call onMessage method with the data object and message object
  await listener.onMessage(data, msg);

  // Write assertions to make sure a ticket was created
  const order = await Order.findById(data.id);

  expect(order).toBeDefined();
  expect(order!.price).toEqual(data.ticket.price);
});

test('should ack the message', async () => {
  const { listener, data, msg } = await setup();

  // Call onMessage method with the data object and message object
  await listener.onMessage(data, msg);

  // Write assertions to make sure ack method was called
  expect(msg.ack).toHaveBeenCalled();
});

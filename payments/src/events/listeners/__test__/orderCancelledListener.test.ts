import { OrderCancelledEvent, OrderStatus } from '@zeetickets/lib';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../config/natsWrapper';
import { OrderCancelledListener } from '../orderCancelledListener';
import { Order } from '../../../models/orderModel';

const setup = async () => {
  // Create an instance of a listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // Create and save an order
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    price: 20,
    userId: 'asdf',
    status: OrderStatus.Created,
    version: 0,
  });
  await order.save();

  // Create a fake data object
  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: mongoose.Types.ObjectId().toHexString(),
    },
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, data, msg };
};

test('should cancel an order', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

test('should ack the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

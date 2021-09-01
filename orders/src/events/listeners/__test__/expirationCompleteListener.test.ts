import { ExpirationCompleteEvent } from '@zeetickets/lib';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../config/natsWrapper';
import { Order, OrderStatus } from '../../../models/orderModel';
import { Ticket } from '../../../models/ticketModel';
import { ExpirationCompleteListener } from '../expirationCompleteListener';

const setup = async () => {
  // Create an instance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  // Create a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // Create an order
  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'asdf',
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  // Create a fake data object
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  // Create a fake message object
  // @ts-ignore ===> we only care about the ack method
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, order, data, msg };
};

test('should update the order status to cancelled', async () => {
  const { listener, order, data, msg } = await setup();

  // Call onMessage method with the data object and message object
  await listener.onMessage(data, msg);

  // Write assertions to make sure the order was cancelled
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

test('should emit an OrderCancelled event', async () => {
  const { listener, order, data, msg } = await setup();

  // Call onMessage method with the data object and message object
  await listener.onMessage(data, msg);

  // Write assertions
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);
});

test('should ack the message', async () => {
  const { listener, data, msg } = await setup();

  // Call onMessage method with the data object and message object
  await listener.onMessage(data, msg);

  // Write assertions to make sure ack method was called
  expect(msg.ack).toHaveBeenCalled();
});

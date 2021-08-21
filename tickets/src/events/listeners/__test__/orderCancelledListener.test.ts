import { OrderCancelledEvent } from '@zeetickets/lib';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../config/natsWrapper';
import { Ticket } from '../../../models/ticketModel';
import { OrderCancelledListener } from '../orderCancelledListener';

const setup = async () => {
  // Create an instance of a listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // Create and save a ticket
  const orderId = mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: 'asdf',
  });
  ticket.set({ orderId }); // For testing purpose, we don't need an orderId when we are creating a ticket in reality
  await ticket.save();

  // Create a fake data object
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, orderId, ticket, data, msg };
};

test('should set the orderId of the ticket to undefined', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toBeUndefined();
});

test('should ack the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

test('should publish a ticket updated event', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  // // @ts-ignore
  // console.log(natsWrapper.client.publish.mock.calls);

  // // To tell TS we're dealing with a mock function(i.e not using @ts-ignore)
  // console.log((natsWrapper.client.publish as jest.Mock).mock.calls)

  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(ticketUpdatedData.orderId).toBeUndefined();
});

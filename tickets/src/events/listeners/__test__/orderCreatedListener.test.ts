import { OrderCreatedEvent, OrderStatus } from '@zeetickets/lib';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../config/natsWrapper';
import { Ticket } from '../../../models/ticketModel';
import { OrderCreatedListener } from '../orderCreatedListener';

const setup = async () => {
  // Create an instance of a listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: 'asdf',
  });
  await ticket.save();

  // Create a fake data object
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: 'asdf',
    expiresAt: 'asdf',
    version: 0,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

test('should set the orderId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toBeDefined();
  expect(updatedTicket!.orderId).toEqual(data.id);
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

  expect(data.id).toEqual(ticketUpdatedData.orderId);
});

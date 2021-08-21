import { TicketCreatedEvent } from '@zeetickets/lib';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { version } from 'typescript';
import { natsWrapper } from '../../../config/natsWrapper';
import { Ticket } from '../../../models/ticketModel';
import { TicketCreatedListener } from '../ticketCreatedListeners';

const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // Create a fake data object
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  };

  // Create a fake message object
  // @ts-ignore ===> we only care about the ack method
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

test('should create a ticket', async () => {
  const { listener, data, msg } = await setup();

  // Call onMessage method with the data object and message object
  await listener.onMessage(data, msg);

  // Write assertions to make sure a ticket was created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

test('should ack the message', async () => {
  const { listener, data, msg } = await setup();

  // Call onMessage method with the data object and message object
  await listener.onMessage(data, msg);

  // Write assertions to make sure ack method was called
  expect(msg.ack).toHaveBeenCalled();
});

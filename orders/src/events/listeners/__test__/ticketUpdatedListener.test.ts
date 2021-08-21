import { TicketUpdatedEvent } from '@zeetickets/lib';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../config/natsWrapper';
import { Ticket } from '../../../models/ticketModel';
import { TicketUpdatedListener } from '../ticketUpdatedListener';

const setup = async () => {
  // Create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // Create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    title: 'Clubfare',
    price: 50,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: ticket.version + 1,
  };

  // Create a fake message object
  // @ts-ignore ===> we only care about the ack method
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

test('should find, update, and save a ticket', async () => {
  const { listener, ticket, data, msg } = await setup();

  // Call onMessage method with the data object and message object
  await listener.onMessage(data, msg);

  // Write assertions
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

test('should ack the message', async () => {
  const { listener, data, msg } = await setup();

  // Call onMessage method with the data object and message object
  await listener.onMessage(data, msg);

  // Write assertions to make sure ack method was called
  expect(msg.ack).toHaveBeenCalled();
});

test('should not call ack method if the event has a skipped version number', async () => {
  const { listener, ticket, data, msg } = await setup();

  data.version = 5;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});

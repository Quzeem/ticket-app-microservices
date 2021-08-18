import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@zeetickets/lib';
import { Ticket } from '../../models/ticketModel';
import { queueGroupName } from './queueGroupName';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;

  queueGroupName = queueGroupName;

  async onMessage(parsedData: TicketUpdatedEvent['data'], msg: Message) {
    const { id, title, price } = parsedData;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}

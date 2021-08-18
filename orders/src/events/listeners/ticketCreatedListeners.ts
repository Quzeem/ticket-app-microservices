import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@zeetickets/lib';
import { Ticket } from '../../models/ticketModel';
import { queueGroupName } from './queueGroupName';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;

  queueGroupName = queueGroupName;

  async onMessage(parsedData: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = parsedData;

    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}

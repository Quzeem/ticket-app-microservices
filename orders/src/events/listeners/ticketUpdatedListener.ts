import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@zeetickets/lib';
import { Ticket } from '../../models/ticketModel';
import { queueGroupName } from './queueGroupName';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;

  queueGroupName = queueGroupName;

  async onMessage(parsedData: TicketUpdatedEvent['data'], msg: Message) {
    // const { id, title, price, version } = parsedData;
    const { title, price } = parsedData;

    // Solves concurrency issues
    // const ticket = await Ticket.findOne({ _id: id, version: version - 1 });

    // Solves concurrency issues
    const ticket = await Ticket.findByIdAndPreVersion(parsedData);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ title, price });
    await ticket.save();

    // // Without using mongoose-update-if-current OCC plugin
    // ticket.set({ title, price, version });
    // await ticket.save();

    msg.ack();
  }
}

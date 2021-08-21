import { Listener, OrderCreatedEvent, Subjects } from '@zeetickets/lib';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticketModel';
import { TicketUpdatedPublisher } from '../publishers/ticketUpdatedPublisher';
import { queueGroupName } from './queueGroupName';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(parsedData: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket that the order service is reserving
    const ticket = await Ticket.findById(parsedData.ticket.id);

    // Throw an error if the ticket is not found
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Mark(lock) the ticket as being reserved by setting its orderId property
    // ticket.orderId = parsedData.id;
    ticket.set({ orderId: parsedData.id });

    // save the ticket
    await ticket.save();

    // Publish ticket updated event
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    // Ack the message
    msg.ack();
  }
}

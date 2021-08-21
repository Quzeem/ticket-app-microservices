import { Listener, OrderCancelledEvent, Subjects } from '@zeetickets/lib';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticketModel';
import { TicketUpdatedPublisher } from '../publishers/ticketUpdatedPublisher';
import { queueGroupName } from './queueGroupName';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;

  queueGroupName = queueGroupName;

  async onMessage(parsedData: OrderCancelledEvent['data'], msg: Message) {
    // Find the ticket that the order service is cancelling
    const ticket = await Ticket.findById(parsedData.ticket.id);

    // Throw an error if the ticket is not found
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Unreserved the ticket by setting its orderId property to undefined
    // ticket.orderId = undefined;
    ticket.set({ orderId: undefined });

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

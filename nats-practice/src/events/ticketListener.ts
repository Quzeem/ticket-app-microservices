import { Message } from 'node-nats-streaming';
import { Listener } from './baseListener';
import { TicketCreatedEvent } from './ticketCreatedEvent';
import { Subjects } from './subjects';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  // subject: Subjects.TicketCreated = Subjects.TicketCreated;
  readonly subject = Subjects.TicketCreated;
  queueGroupName = 'orders-service';

  onMessage(parsedData: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data:', parsedData);

    // Acknowledge message(assuming everything goes well)
    msg.ack();
  }
}

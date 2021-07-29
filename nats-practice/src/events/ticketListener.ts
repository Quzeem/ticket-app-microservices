import { Message } from 'node-nats-streaming';
import { Listener } from './baseListener';

export class TicketCreatedListener extends Listener {
  subject = 'ticket:created';
  queueGroupName = 'orders-service';
  onMessage(parsedData: any, msg: Message) {
    console.log('Event data:', parsedData);

    // Acknowledge message(assuming everything goes well)
    msg.ack();
  }
}

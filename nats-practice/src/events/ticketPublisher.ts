import { Subjects } from './subjects';
import { TicketCreatedEvent } from './ticketCreatedEvent';
import { Publisher } from './basePublisher';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}

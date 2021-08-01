import { Publisher, Subjects, TicketUpdatedEvent } from '@zeetickets/lib';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}

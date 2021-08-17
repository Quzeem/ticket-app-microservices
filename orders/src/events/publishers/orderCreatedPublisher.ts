import { Publisher, OrderCreatedEvent, Subjects } from '@zeetickets/lib';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}

import { Publisher, Subjects, OrderCancelledEvent } from '@zeetickets/lib';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}

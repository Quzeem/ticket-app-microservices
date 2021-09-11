import { PaymentCreatedEvent, Publisher, Subjects } from '@zeetickets/lib';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}

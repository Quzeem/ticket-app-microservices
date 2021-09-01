import { ExpirationCompleteEvent, Publisher, Subjects } from '@zeetickets/lib';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}

import { Listener, OrderCreatedEvent, Subjects } from '@zeetickets/lib';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queue/expirationQueue';
import { queueGroupName } from './queueGroupName';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(parsedData: OrderCreatedEvent['data'], msg: Message) {
    const delay =
      new Date(parsedData.expiresAt).getTime() - new Date().getTime();

    console.log(
      `Waiting ${delay} milliseconds to process the job: ${parsedData.id}`
    );

    // Enqueue a job (create a new job and add it to the expiration queue)
    await expirationQueue.add(
      {
        orderId: parsedData.id,
      },
      {
        // delay: 10000,
        delay,
      }
    );

    msg.ack();
  }
}

import { Listener, OrderCreatedEvent, Subjects } from '@zeetickets/lib';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/orderModel';
import { queueGroupName } from './queueGroupName';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(parsedData: OrderCreatedEvent['data'], msg: Message) {
    const order = await Order.build({
      id: parsedData.id,
      price: parsedData.ticket.price,
      userId: parsedData.userId,
      status: parsedData.status,
      version: parsedData.version,
    });
    await order.save();

    msg.ack();
  }
}

import {
  ExpirationCompleteEvent,
  Listener,
  NotFoundError,
  OrderStatus,
  Subjects,
} from '@zeetickets/lib';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../config/natsWrapper';
import { Order } from '../../models/orderModel';
import { OrderCancelledPublisher } from '../publishers/orderCancelledPublisher';
import { queueGroupName } from './queueGroupName';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(parsedData: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(parsedData.orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Avoid completed orders cancellation
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({ status: OrderStatus.Cancelled });

    await order.save();

    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}

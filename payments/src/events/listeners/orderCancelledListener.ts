import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from '@zeetickets/lib';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queueGroupName';
import { Order } from '../../models/orderModel';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;

  queueGroupName = queueGroupName;

  async onMessage(parsedData: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findOne({
      _id: parsedData.id,
      version: parsedData.version - 1,
    });

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    // Ack the message
    msg.ack();
  }
}

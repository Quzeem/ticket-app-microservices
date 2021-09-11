import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from '@zeetickets/lib';
import { queueGroupName } from './queueGroupName';
import { Order } from '../../models/orderModel';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;

  queueGroupName = queueGroupName;

  async onMessage(parsedData: PaymentCreatedEvent['data'], msg: Message) {
    const { orderId } = parsedData;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();

    // In the context of this app, once an order is marked as complete, we're done(no futher update will be done). So, publishing an event(say: OrderUpdated) is optional.

    msg.ack();
  }
}

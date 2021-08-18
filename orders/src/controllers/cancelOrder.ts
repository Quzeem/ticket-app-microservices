import { Request, Response } from 'express';
import { Order, OrderStatus } from '../models/orderModel';
import { NotFoundError, NotAuthorizedError } from '@zeetickets/lib';
import { OrderCancelledPublisher } from '../events/publishers/orderCancelledPublisher';
import { natsWrapper } from '../config/natsWrapper';

const cancelOrder = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate('ticket');

  if (!order) {
    throw new NotFoundError('Order not found');
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  order.status = OrderStatus.Cancelled;
  await order.save();

  // Publish an event
  const publisher = new OrderCancelledPublisher(natsWrapper.client);
  publisher.publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id,
    },
  });

  res.status(200).send({ status: 'success', data: order });
};

export { cancelOrder };

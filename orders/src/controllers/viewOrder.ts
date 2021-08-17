import { Request, Response } from 'express';
import { Order } from '../models/orderModel';
import { NotAuthorizedError, NotFoundError } from '@zeetickets/lib';

const viewOrderDetails = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate('ticket');

  if (!order) {
    throw new NotFoundError('Order not found');
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  res.status(200).send({ status: 'success', data: order });
};

export { viewOrderDetails };

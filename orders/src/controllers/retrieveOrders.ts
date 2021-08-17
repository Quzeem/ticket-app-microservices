import { Request, Response } from 'express';
import { Order } from '../models/orderModel';

const retrieveOrders = async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req.currentUser!.id }).populate(
    'ticket'
  );

  res.status(200).send({ status: 'success', data: orders });
};

export { retrieveOrders };

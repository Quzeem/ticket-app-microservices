import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from '@zeetickets/lib';
import { Request, Response } from 'express';
import { Order } from '../models/orderModel';
// import { Payment } from '../models/paymentModel';
// import { stripe } from '../config/stripe';
import { PaymentCreatedPublisher } from '../events/publishers/paymentCreatedPublisher';
import { natsWrapper } from '../config/natsWrapper';
import { Payment } from '../models/paymentModel';

const createPayment = async (req: Request, res: Response) => {
  const { orderId, token } = req.body;

  // Check if order exists
  const order = await Order.findById(orderId);
  if (!order) {
    throw new NotFoundError('Order not found');
  }

  // Check if the current user owns the order
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  // Check if the order has not been cancelled
  if (order.status === OrderStatus.Cancelled) {
    throw new BadRequestError('Payments not allowed for a cancelled order');
  }

  // Use stripe API to charge user
  // const charge = await stripe.charges.create({
  //   amount: order.price * 100, // e.g., 100 cents to charge $1.00
  //   currency: 'usd',
  //   source: token,
  // });

  // Save the payment details for reference purpose
  // const payment = Payment.build({ orderId, stripeId: charge.id });
  // await payment.save();
  const payment = Payment.build({ orderId, stripeId: 'asdf1234jkl' }); // fake stripeId
  await payment.save();

  new PaymentCreatedPublisher(natsWrapper.client).publish({
    id: payment.id,
    orderId: order.id,
    stripeId: payment.stripeId,
  });

  res.status(201).send({ status: 'success', data: payment });
};

export { createPayment };

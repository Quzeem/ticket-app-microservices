import { Request, Response } from 'express';
import { NotFoundError, BadRequestError, OrderStatus } from '@zeetickets/lib';
import { Order } from '../models/orderModel';
import { Ticket } from '../models/ticketModel';

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

const createOrder = async (req: Request, res: Response) => {
  const { ticketId } = req.body;

  // A) Find the ticket the user is trying to purchase in the DB
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new NotFoundError('Ticket not found');
  }

  // B) Ensure that the ticket has not been reserved for a user
  // Run query to look at all orders. Find an order where the ticket is the ticket we just found *and* the order status is *not* cancelled. If we find that order, that means the ticket has been reserved
  // const existingOrder = await Order.findOne({
  //   ticket: ticket.id,
  //   status: {
  //     $in: [
  //       OrderStatus.Created,
  //       OrderStatus.AwaitingPayment,
  //       OrderStatus.Complete,
  //     ],
  //   },
  //   // status: { $ne: OrderStatus.Cancelled },
  // });
  // if (existingOrder) {
  //   throw new BadRequestError('Ticket is already reserved');
  // }
  const isReserved = await ticket.isReserved();
  if (isReserved) {
    throw new BadRequestError('Ticket is already reserved');
  }

  // C) Calculate an expiration date for this order
  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

  // D) Build the order and save it to the database
  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket: ticket.id,
  });
  await order.save();

  // E) Publish an event that the order has been created

  res.status(201).send({ status: 'success', data: order });
};

export { createOrder };

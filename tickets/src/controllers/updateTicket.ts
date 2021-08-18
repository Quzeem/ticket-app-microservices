import { Request, Response } from 'express';
import { Ticket } from '../models/ticketModel';
import { NotFoundError, NotAuthorizedError } from '@zeetickets/lib';
import { TicketUpdatedPublisher } from '../events/publishers/ticketUpdatedPublisher';
import { natsWrapper } from '../config/natsWrapper';

const updateTicket = async (req: Request, res: Response) => {
  const { title, price } = req.body;

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError('Ticket not found');
  }

  if (ticket.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  ticket.set({ title, price });
  await ticket.save();

  // publish event
  new TicketUpdatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version,
  });

  res.status(200).send({ status: 'success', data: ticket });
};

export { updateTicket };

import { Request, Response } from 'express';
import { Ticket } from '../models/ticketModel';
import { NotFoundError, NotAuthorizedError } from '@zeetickets/lib';

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

  res.status(200).send({ status: 'success', data: ticket });
};

export { updateTicket };

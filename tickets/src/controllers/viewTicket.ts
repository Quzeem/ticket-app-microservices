import { Request, Response } from 'express';
import { Ticket } from '../models/ticketModel';
import { NotFoundError } from '@zeetickets/lib';

const viewTicket = async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError('Ticket not found');
  }

  res.status(200).send({ status: 'success', data: ticket });
};

export { viewTicket };

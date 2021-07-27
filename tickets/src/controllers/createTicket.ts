import { Request, Response } from 'express';
import { Ticket } from '../models/ticketModel';

const createTicket = async (req: Request, res: Response) => {
  // req.body.userId = req.currentUser!.id;
  // const ticket = Ticket.build(req.body);

  const { title, price } = req.body;

  const ticket = Ticket.build({
    title,
    price,
    userId: req.currentUser!.id,
  });
  await ticket.save();

  res.status(201).send({ status: 'success', data: ticket });
};

export { createTicket };

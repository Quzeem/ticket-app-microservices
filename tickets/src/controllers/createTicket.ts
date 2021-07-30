import { Request, Response } from 'express';
import { Ticket } from '../models/ticketModel';
import { TicketCreatedPublisher } from '../events/publishers/ticketCreatedPublisher';
import { natsWrapper } from '../config/natsWrapper';

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

  // publish event
  await new TicketCreatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
  });

  res.status(201).send({ status: 'success', data: ticket });
};

export { createTicket };

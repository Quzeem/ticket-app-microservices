import { Request, Response } from 'express';
import { Ticket } from '../models/ticketModel';

const retrieveTickets = async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});
  res.status(200).send({ status: 'success', data: tickets });
};

export { retrieveTickets };

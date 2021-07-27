import express from 'express';

const router = express.Router();

import { createTicket } from '../controllers/createTicket';
import { retrieveTickets } from '../controllers/retrieveTickets';
import { viewTicket } from '../controllers/viewTicket';
import { updateTicket } from '../controllers/updateTicket';

import validateTicket from '../middlewares/validators/ticketValidator';

import { isLoggedIn, handleValidationError } from '@zeetickets/lib';

router
  .route('/')
  .post(isLoggedIn, validateTicket, handleValidationError, createTicket)
  .get(retrieveTickets);
router
  .route('/:id')
  .get(viewTicket)
  .put(isLoggedIn, validateTicket, handleValidationError, updateTicket);

export { router as ticketsRouter };

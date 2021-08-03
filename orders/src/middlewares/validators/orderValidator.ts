import { body } from 'express-validator';
import mongoose from 'mongoose';

// NOTE: we're making an assumption that our ticket service database is always going to be MongoDB which is a bit dangerous if it's not always going to be the case. Validating the ID as Mongo ID means we are kinda coupling our app in a very subtle way with the ticket service
const validateOrder = [
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input)) // returns true/false
    .withMessage('TicketId is required and must be valid'),
];

export default validateOrder;

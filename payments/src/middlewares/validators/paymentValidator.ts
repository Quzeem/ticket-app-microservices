import { body } from 'express-validator';
import mongoose from 'mongoose';

// NOTE: we're making an assumption that our order service database is always going to be MongoDB which is a bad if it's not always going to be the case. Validating the ID as Mongo ID means we are kinda coupling our app in a very subtle way with the order service
const validatePayment = [
  body('orderId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input)) // returns true/false
    .withMessage('orderId is required and must be valid'),
  body('token').not().isEmpty().withMessage('Stripe token is required'),
];

export default validatePayment;

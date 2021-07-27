import { body } from 'express-validator';

const validateTicket = [
  body('title').trim().not().isEmpty().withMessage('Title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
];

export default validateTicket;

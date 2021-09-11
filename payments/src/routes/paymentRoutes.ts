import express from 'express';

const router = express.Router();

import { createPayment } from '../controllers/createPayment';
import validatePayment from '../middlewares/validators/paymentValidator';

import { handleValidationError, isLoggedIn } from '@zeetickets/lib';

router.post(
  '/',
  isLoggedIn,
  validatePayment,
  handleValidationError,
  createPayment
);

export { router as paymentsRouter };

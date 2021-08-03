import express from 'express';

const router = express.Router();

import { createOrder } from '../controllers/createOrder';

import validateOrder from '../middlewares/validators/orderValidator';

import { isLoggedIn, handleValidationError } from '@zeetickets/lib';

router
  .route('/')
  .post(isLoggedIn, validateOrder, handleValidationError, createOrder);

export { router as ordersRouter };

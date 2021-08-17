import express from 'express';

const router = express.Router();

import { createOrder } from '../controllers/createOrder';
import { retrieveOrders } from '../controllers/retrieveOrders';
import { viewOrderDetails } from '../controllers/viewOrder';
import { cancelOrder } from '../controllers/cancelOrder';

import validateOrder from '../middlewares/validators/orderValidator';

import { isLoggedIn, handleValidationError } from '@zeetickets/lib';

router
  .route('/')
  .post(isLoggedIn, validateOrder, handleValidationError, createOrder)
  .get(isLoggedIn, retrieveOrders);

router
  .route('/:orderId')
  .get(isLoggedIn, viewOrderDetails)
  .put(isLoggedIn, cancelOrder);

export { router as ordersRouter };

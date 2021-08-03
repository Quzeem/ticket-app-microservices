import express, { Request, Response } from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, setCurrentUser } from '@zeetickets/lib';
import { ordersRouter } from './routes/orderRoutes';

const app = express();

// Traffic is being proxy to our app through ingress-nginx. This is to make express trust the traffic as being secure.
app.set('trust proxy', true); // app.enable('trust proxy')
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
    httpOnly: true,
  })
);
app.use(setCurrentUser);

app.use('/api/orders', ordersRouter);

app.all('*', async (req: Request, res: Response) => {
  throw new NotFoundError(
    `${req.method} request to: ${req.originalUrl} not available on this server!`
  );
});
app.use(errorHandler);

export { app };

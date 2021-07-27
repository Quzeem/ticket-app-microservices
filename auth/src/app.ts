import express, { Request, Response } from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { authRouter } from './routes/authRoutes';
// import { errorHandler } from './middlewares/errorHandler';
// import { NotFoundError } from './errors/notFoundError';
import { errorHandler, NotFoundError } from '@zeetickets/lib';

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

app.use('/api/users', authRouter);

app.all('*', async (req: Request, res: Response) => {
  throw new NotFoundError(
    `${req.method} request to: ${req.originalUrl} not available on this server!`
  );
});
app.use(errorHandler);

export { app };

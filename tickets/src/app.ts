import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

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

app.all('*', async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };

import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { authRouter } from './routes/authRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { NotFoundError } from './errors/notFoundError';
import { connectDB } from './config/db';

const app = express();

// Traffic is being proxy to our app through ingress-nginx. This is to make express trust the traffic as being secure.
app.set('trust proxy', true); // app.enable('trust proxy')
app.use(express.json());
app.use(cookieSession({ signed: false, secure: true, httpOnly: true }));

app.use('/api/users', authRouter);

app.all('*', async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined');
}

connectDB();

app.listen(3000, () => console.log('Server listening on port 3000'));

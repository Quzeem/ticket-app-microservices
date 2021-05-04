import express from 'express';
import 'express-async-errors';

import { authRouter } from './routes/authRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { NotFoundError } from './errors/notFoundError';
import { connectDB } from './config/db';

// connect to DB
connectDB();

const app = express();
app.use(express.json());

app.use('/api/users', authRouter);

app.all('*', async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

app.listen(3000, () => console.log('Server listening on port 3000'));

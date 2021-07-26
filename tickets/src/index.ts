import { app } from './app';
import { connectDB } from './config/db';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined');
}
if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI must be defined');
}

connectDB();

app.listen(3000, () => console.log('Server listening on port 3000'));

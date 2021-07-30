import { app } from './app';
import { connectDB } from './config/db';
import { connectNATS } from './config/nats';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined');
}
if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI must be defined');
}

// Connect to MongoDB
connectDB();
// Connect to NATS
connectNATS();

app.listen(3000, () => console.log('Server listening on port 3000'));

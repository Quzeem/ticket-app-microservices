import { app } from './app';
import { connectDB } from './config/db';
import { connectNATS } from './config/nats';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined');
}
if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI must be defined');
}
if (!process.env.NATS_CLIENT_ID) {
  throw new Error('NATS_CLIENT_ID must be defined');
}
if (!process.env.NATS_URL) {
  throw new Error('NATS_URL must be defined');
}
if (!process.env.NATS_CLUSTER_ID) {
  throw new Error('NATS_CLUSTER_ID must be defined');
}
// if (!process.env.STRIPE_KEY) {
//   throw new Error('STRIPE_KEY must be defined');
// }

// Connect to MongoDB
connectDB();
// Connect to NATS
connectNATS();

app.listen(3000, () => console.log('Server listening on port 3000'));

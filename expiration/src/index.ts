import { connectNATS } from './config/nats';

if (!process.env.NATS_CLIENT_ID) {
  throw new Error('NATS_CLIENT_ID must be defined');
}
if (!process.env.NATS_URL) {
  throw new Error('NATS_URL must be defined');
}
if (!process.env.NATS_CLUSTER_ID) {
  throw new Error('NATS_CLUSTER_ID must be defined');
}
if (!process.env.REDIS_HOST) {
  throw new Error('REDIS_HOST must be defined');
}

// Connect to NATS
connectNATS();

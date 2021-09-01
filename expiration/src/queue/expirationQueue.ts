import Queue from 'bull';
import { natsWrapper } from '../config/natsWrapper';
import { ExpirationCompletePublisher } from '../events/publishers/expirationCompletePublisher';

interface Payload {
  orderId: string;
}

// Create a queue
const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

// Code to process a job from a queue
expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };

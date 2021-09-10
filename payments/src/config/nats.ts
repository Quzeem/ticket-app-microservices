import { natsWrapper } from './natsWrapper';
import { OrderCancelledListener } from '../events/listeners/orderCancelledListener';
import { OrderCreatedListener } from '../events/listeners/orderCreatedListener';

export const connectNATS = async () => {
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close()); // Listen for interrupt signals
    process.on('SIGTERM', () => natsWrapper.client.close()); // Listen for terminate signals

    // Listen for events
    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();
  } catch (err) {
    console.error(err);
  }
};

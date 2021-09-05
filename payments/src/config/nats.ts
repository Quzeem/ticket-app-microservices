import { natsWrapper } from './natsWrapper';

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
  } catch (err) {
    console.error(err);
  }
};

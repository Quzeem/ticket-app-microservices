import { natsWrapper } from './natsWrapper';

export const connectNATS = async () => {
  try {
    await natsWrapper.connect('zeeticket', 'abc', 'http://nats-srv:4222');
  } catch (err) {
    console.error(err);
  }
};

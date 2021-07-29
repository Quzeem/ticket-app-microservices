import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

// ClientID must always be unique to have as many clients as we want
const clientId = randomBytes(4).toString('hex');

const stan = nats.connect('zeeticket', clientId, {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  // We can only essentially share strings or raw data
  const data = JSON.stringify({
    id: '123',
    title: 'Concert',
    price: 50,
    userId: '456',
  });

  // The data and callback fn is optional
  stan.publish('ticket:created', data, () => {
    console.log('Event published');
  });
});

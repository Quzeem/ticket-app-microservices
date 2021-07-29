import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

// ClientID must always be unique to have as many clients as we want
const clientId = randomBytes(4).toString('hex');

const stan = nats.connect('zeeticket', clientId, {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });

  // // subscription options
  // const options = stan
  //   .subscriptionOptions()
  //   .setManualAckMode(true)
  //   .setDeliverAllAvailable()
  //   .setDurableName('orders-service');

  // // Subscribe to 'ticket:created' channel
  // const subscription = stan.subscribe(
  //   'ticket:created',
  //   'orders-service-queue-group',
  //   options
  // );

  // subscription.on('message', (msg: Message) => {
  //   const data = msg.getData();

  //   if (typeof data === 'string') {
  //     console.log(
  //       `Recieved event #${msg.getSequence()}, with the data: ${data}`
  //     );
  //   }

  //   // Manually acknowledge that the event has been processed
  //   msg.ack();
  // });

  // Using TicketCreatedListener class
  new TicketCreatedListener(stan).listen();
});

// Graceful client shutdown
process.on('SIGINT', () => stan.close()); // Listen for interrupt signals
process.on('SIGTERM', () => stan.close()); // Listen for terminate signals

// Listener Abstract Class
abstract class Listener {
  // Name of the channel a subclass of Listener class is going to listen to(required)
  abstract subject: string;
  // Name of the queue group a subclass of Listener class is going to join(required)
  abstract queueGroupName: string;
  // Subclasses of Listener class must implement this method to handle message received
  abstract onMessage(parsedData: any, msg: Message): void;

  // Accessible in this class definition only
  private client: Stan;
  // Accessible in this class definition and its subclasses
  protected ackWait = 5 * 1000; // 5s

  constructor(client: Stan) {
    this.client = client;
  }

  // Default subscription options
  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  // Setup the subscription for a subject and listen for a message
  listen() {
    // Subscribe to a subject
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    // Listen for a message
    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      // parse the message
      const parsedData = this.parseMessage(msg);

      // a method to be run by subclasses when a message is received
      this.onMessage(parsedData, msg);
    });
  }

  // Parse a message
  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }
}

class TicketCreatedListener extends Listener {
  subject = 'ticket:created';
  queueGroupName = 'orders-service';
  onMessage(parsedData: any, msg: Message) {
    console.log('Event data:', parsedData);

    // Acknowledge message(assuming everything goes well)
    msg.ack();
  }
}

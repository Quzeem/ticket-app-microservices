import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

// Listener Abstract Class
export abstract class Listener<T extends Event> {
  // Name of the channel a subclass of Listener class is going to listen to(required)
  abstract subject: T['subject'];
  // Name of the queue group a subclass of Listener class is going to join(required)
  abstract queueGroupName: string;
  // Subclasses of Listener class must implement this method to handle message received
  abstract onMessage(parsedData: T['data'], msg: Message): void;

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

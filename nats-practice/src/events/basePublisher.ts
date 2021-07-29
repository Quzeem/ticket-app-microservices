import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  // Name of the channel a subclass of Publisher class is going to publish to(required)
  abstract subject: T['subject'];

  // Accessible in this class definition only
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T['data']) {
    this.client.publish(this.subject, JSON.stringify(data), () => {
      console.log('Event published');
    });
  }
}

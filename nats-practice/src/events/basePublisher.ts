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

  // Publishing an event to NATS streaming server is an async operation. This is cool for a scenario that we want an event to be published before doing something else in our code
  publish(data: T['data']): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }

        console.log('Event published to subject', this.subject);
        resolve();
      });
    });
  }
}

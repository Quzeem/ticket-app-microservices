import mongoose from 'mongoose';
import { Order, OrderStatus } from './orderModel';

interface TicketAttrs {
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => new Ticket(attrs);

// Run query to look at all orders. Find an order where the ticket is the ticket we just found *and* the order status is *not* cancelled. If we find that order, that means the ticket has been reserved
ticketSchema.methods.isReserved = async function () {
  // this === The ticket document that we just called 'isReserved' method on
  const existingOrder = await Order.findOne({
    // ticket: this as TicketDoc,
    ticket: this.id,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder; // Boolean value
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };

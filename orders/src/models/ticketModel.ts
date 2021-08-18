import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order, OrderStatus } from './orderModel';

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByIdAndPreVersion(eventData: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
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

// Change '__v' to 'version'
ticketSchema.set('versionKey', 'version');

// Optimisitc Concurrency Control plugin(uses schema's version key by default)
ticketSchema.plugin(updateIfCurrentPlugin);

// // Without using mongoose-update-if-current OCC plugin
// ticketSchema.pre('save', function (next) {
//   // Specify additional property to attach to the query when calling save() and isNew is false
//   this.$where = {
//     version: this.get('version') - 1, // Assuming we are incrementing the doc version by 1 everytime
//   };

//   next();
// });

// Custom Query
ticketSchema.statics.findByIdAndPreVersion = (eventData: {
  id: string;
  version: number;
}) => {
  return Ticket.findOne({ _id: eventData.id, version: eventData.version - 1 });
};

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  const ticketData = { _id: attrs.id, ...attrs };
  return new Ticket(ticketData);
};

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

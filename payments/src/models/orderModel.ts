import { OrderStatus } from '@zeetickets/lib';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface OrderAttrs {
  id: string;
  price: number;
  userId: string;
  status: OrderStatus;
  version: number;
}

export interface OrderDoc extends mongoose.Document {
  price: number;
  userId: string;
  status: OrderStatus;
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
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
orderSchema.set('versionKey', 'version');

// Optimisitc Concurrency Control plugin(uses schema's version key by default)
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
    version: attrs.version,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };

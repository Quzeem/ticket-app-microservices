import mongoose from 'mongoose';

interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}

export interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
  version: number; // Just for consistency, won't be using it for OCC.
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
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
paymentSchema.set('versionKey', 'version');

paymentSchema.statics.build = (attrs: PaymentAttrs) => new Payment(attrs);

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  'Payment',
  paymentSchema
);

export { Payment };

import mongoose from 'mongoose';
import { Password } from '../utils/password';

// Describes what properties are required to create a user
interface UserAttrs {
  email: string;
  password: string;
}

// Describes what properties and methods a user model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// Describes what properties a user document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
      // virtuals: true,
    },
  }
);

// // Delete some fiels from data to return to the client
// userSchema.methods.toJSON = function () {
//   const user = this.toObject();
//   user.id = user._id;
//   delete user._id;
//   delete user.password; // pending issue here
//   delete user.__v;

//   return user;
// };

// Hash text plain password
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hashed = await Password.hash(this.get('password'));
    this.set('password', hashed);
  }
  next();
});

userSchema.statics.build = (attrs: UserAttrs) => new User(attrs);

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// const buildUser = (attrs: UserAttrs) => new User(attrs);

export { User };

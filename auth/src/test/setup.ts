import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

// Augment Node.js global object to account for signup method
declare global {
  namespace NodeJS {
    interface Global {
      signup(): Promise<string[]>;
    }
  }
}

let mongo: any;

// A hook that will run before all our tests run
beforeAll(async () => {
  // Since our env vars only get defined when we run our code inside of a pod, we have to set them in our test env.
  // NB: This is not the best way to set them in a test env
  process.env.JWT_SECRET = 'asdf';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
});

// A hook that will run before each of our tests run
beforeEach(async () => {
  // Get all collections that exists
  const collections = await mongoose.connection.db.collections();

  // Delete data in each collection
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// A hook that will run after all our tests run
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

// Instead of adding this method to Node.js global object, a module(say authHelper.ts) can be created in test folder and exported across modules where it's needed
global.signup = async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201);

  const cookie = res.get('Set-Cookie');
  return cookie;
};

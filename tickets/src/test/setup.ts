import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

// Augment Node.js global object to account for signup method
declare global {
  namespace NodeJS {
    interface Global {
      signup(): string[];
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
// Faking Authentication
global.signup = () => {
  // Build a JWT payload ==> { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  // Create JWT
  const token = jwt.sign(payload, process.env.JWT_SECRET!);

  // Build session object ==> req.session = { jwt: token }
  const sessionObj = { jwt: token };

  // Turn the session object into JSON
  const sessionObjJSON = JSON.stringify(sessionObj);

  // Encode the sessionObjJSON as base64
  const base64 = Buffer.from(sessionObjJSON).toString('base64');

  // return a string that's the cookie with the encoded data
  return [`express:sess=${base64}`];
};

import { Request } from 'express';

export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message); // The message is just for logging purposes

    // Needs to be added when extending to a class in typescript
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(req: Request): { status: string; message: string };
}

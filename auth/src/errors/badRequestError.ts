import { CustomError } from './customError';

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);

    // Needs to be added when extending to a class in typescript
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return { status: 'fail', message: this.message };
  }
}

import { ValidationError } from 'express-validator';
import { CustomError } from './customError';

export class RequestValidationError extends CustomError {
  // errors: ValidationError[]
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('Invalid request data');
    // this.errors = errors

    // Needs to be added when extending to a class in typescript
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    const msgs = this.errors.map((errObj) => errObj.msg);
    const message = `Bad Input: ${msgs.join(', ')}`;
    return { status: 'fail', message };
  }
}

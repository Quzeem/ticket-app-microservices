import { CustomError } from './customError';

export class NotAuthenticatedError extends CustomError {
  statusCode = 401;

  constructor() {
    super('Not Authenticated');

    // Needs to be added when extending to a class in typescript
    Object.setPrototypeOf(this, NotAuthenticatedError.prototype);
  }

  serializeErrors() {
    return {
      status: 'fail',
      message: 'Not authenticated! Please login to gain access',
    };
  }
}

import { CustomError } from './customError';
import { Request } from 'express';

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super('Route not found');
    // Needs to be added when extending to a class in typescript
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors(request: Request) {
    return {
      status: 'fail',
      message: `${request.method} request to: ${request.originalUrl} not available on this server`,
    };
  }
}

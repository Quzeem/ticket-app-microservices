import { Request, Response, NextFunction } from 'express';
// import { RequestValidationError } from '../utils/requestValidationError';
// import { NotFoundError } from '../utils/notFoundError';
import { CustomError } from '../errors/customError';

// Global error handler
// eslint-disable-next-line no-unused-vars
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log('Error: ', err);

  // if (err instanceof RequestValidationError) {
  //   return res.status(err.statusCode).send(err.serializeErrors());
  // }
  // if (err instanceof NotFoundError) {
  //   return res.status(err.statusCode).send(err.serializeErrors(req));
  // }

  // we can always be sure all instances of abstract class 'CustomError' will have a statusCode property and serializeErrors method
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send(err.serializeErrors(req));
  }

  // Default error response
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const message = `${statusCode}`.startsWith('4')
    ? err.message
    : 'Something went wrong!';

  res.status(statusCode).send({
    status: 'fail',
    message,
  });
};

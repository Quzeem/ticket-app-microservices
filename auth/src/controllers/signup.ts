import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../utils/requestValidationError';

const signup = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array({ onlyFirstError: true }));
    // return res
    //   .status(400)
    //   .send({ errors: errors.array({ onlyFirstError: true }) });
  }

  res.send('Hello there!');
};

export { signup };

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/requestValidationError';
import { BadRequestError } from '../errors/badRequestError';
import { User } from '../models/userModel';

const signup = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array({ onlyFirstError: true }));
    // return res
    //   .status(400)
    //   .send({ errors: errors.array({ onlyFirstError: true }) });
  }

  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError('Email already in use');
  }

  const user = User.build({ email, password });
  await user.save();

  res.status(201).send({
    status: 'success',
    data: user,
  });
};

export { signup };

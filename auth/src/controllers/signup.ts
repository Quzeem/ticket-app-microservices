import { Request, Response } from 'express';
// import { BadRequestError } from '../errors/badRequestError';
import { BadRequestError } from '@zeetickets/lib';
import { User } from '../models/userModel';
import { generateAuthToken } from '../utils/generateAuthToken';

const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError('Email already in use');
  }

  const user = User.build({ email, password });
  await user.save();

  // Generate JWT
  const token = generateAuthToken({ id: user.id, email: user.email });
  // Assign the jwt to session object
  req.session = {
    jwt: token,
  };

  res.status(201).send({
    status: 'success',
    data: user,
  });
};

export { signup };

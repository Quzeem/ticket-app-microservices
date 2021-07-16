import { Request, Response } from 'express';
// import { BadRequestError } from '../errors/badRequestError';
import { BadRequestError } from '@zeetickets/lib';
import { User } from '../models/userModel';
import { generateAuthToken } from '../utils/generateAuthToken';
import { Password } from '../utils/password';

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await Password.compare(user.password, password))) {
    throw new BadRequestError('Invalid credentials');
  }

  // Generate JWT
  const token = generateAuthToken({ id: user.id, email: user.email });
  // Assign the jwt to session object
  req.session = {
    jwt: token,
  };

  res.status(200).send({
    status: 'success',
    data: user,
  });
};

export { login };

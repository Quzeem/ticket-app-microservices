import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
// import { User } from '../models/userModel';

interface UserPayload {
  id: string;
  email: string;
}

// Augment(modify) Request type definition by adding currentUser property to it
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const setCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // check if token exist
  if (!req.session?.jwt) {
    return next();
  }

  try {
    // verify token
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_SECRET!
    ) as UserPayload;

    req.currentUser = payload;
  } catch (error) {
    return next();
  }
  next();
};

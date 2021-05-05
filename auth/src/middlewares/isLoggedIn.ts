import { Request, Response, NextFunction } from 'express';
import { NotAuthenticatedError } from '../errors/notAuthenticatedError';

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    throw new NotAuthenticatedError();
  }

  next();
};

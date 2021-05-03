import { Request, Response } from 'express';

const getCurrentUser = (req: Request, res: Response) => {
  res.send('Hello there!');
};

export { getCurrentUser };

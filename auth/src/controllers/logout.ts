import { Request, Response } from 'express';

const logout = (req: Request, res: Response) => {
  res.send('Hello there!');
};

export { logout };

import { Request, Response } from 'express';

const getCurrentUser = (req: Request, res: Response) => {
  res
    .status(200)
    .send({ status: 'success', currentUser: req.currentUser || null });
};

export { getCurrentUser };

import { Request, Response } from 'express';

const logout = (req: Request, res: Response) => {
  req.session = null;
  res.status(200).send({ status: 'success', data: null });
};

export { logout };

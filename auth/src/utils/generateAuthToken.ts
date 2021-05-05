import jwt from 'jsonwebtoken';

interface Payload {
  id: string;
  email: string;
}

export const generateAuthToken = (payload: Payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET!);
};

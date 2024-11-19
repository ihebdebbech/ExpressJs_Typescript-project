import 'dotenv/config';
import jwt from 'jsonwebtoken';

const SECRET = process.env.SecretKEY || 'secret';

export interface IPayload {
  id: number,
  type: string;
}

export default {
  sign: (payload: IPayload) =>
    jwt.sign(payload, SECRET, { expiresIn: "7d", algorithm: 'HS256' }),
  verify: (token: string) => jwt.verify(token, SECRET),
};
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt, { IPayload } from '../utils/jwt';

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  console.log(token)
  if (!token){
    return res.status(StatusCodes.UNAUTHORIZED)
      .json({
        message: 'No token provided',
      });
    }
  try {
    const payload = jwt.verify(token) as IPayload;
    console.log(payload)
    if (payload.type == "authorization") {
      res.locals.payload = payload;
     
      req.headers.userid=payload.id.toString();
      return next();
    } else {
      return res.status(StatusCodes.UNAUTHORIZED)
        .json({
          message: 'Unauthorized',
        });
    }
  } catch(err) {
    console.log(err)
    console.log("wrong token")
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
  }
};

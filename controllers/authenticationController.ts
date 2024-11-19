import { PrismaClient } from '@prisma/client'
import { createaccountservice, forgetPasswordService, loginService, validateCode, } from '../services/authenticationService';
import { isEmailExists, resetPassword, updatefcmtokenuserService } from '../services/userService';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt, { IPayload } from '../utils/jwt';
const user = new PrismaClient().user;

export const createAccountController = async (req: Request, res: Response) => {
  try {
    let userdata = req.body;
    if (userdata.email && userdata.password && userdata.phonenumber &&
      userdata.username && userdata.firstname && userdata.lastname) {
      const isUserExists = await isEmailExists(userdata.email);
      if (!isUserExists) {
        const token = await createaccountservice(userdata);
        return res.status(StatusCodes.ACCEPTED).json({ status: true, token: token });
      }
      else {
        return res.status(StatusCodes.CONFLICT).json({ status: false, message: "an account exist already" });
      }
    }
    else {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "missing data" });
    }
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "try again later" });
  }
};

export const forgetPasswordWithEmail = async (req: Request, res: Response) => {
  try {
    const {email} = req.body.email;
    if (email) {
      const isUserExists = await isEmailExists(email);
      if (!isUserExists) {
        return res.status(StatusCodes.CONFLICT).json({ message: "account does not exsits" });
      }
      else {
        const userWithCode = await forgetPasswordService(isUserExists);
        if (userWithCode) {
          return res.status(StatusCodes.ACCEPTED).json({ message: "email succesfully sent" });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "email failed to send" });
      }
    }
    else {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "missing data" });
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error });
  }
}

export const verifyCodeController = async (req: Request, res: Response) => {
  try {
    let validationCode = req.body;
    if (validationCode) {
      const token = await validateCode(validationCode.code);
      if (token) {
        return res.status(StatusCodes.ACCEPTED).json({ token: token });
      }
      else {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "the code in invalid" });
      }
    }
    else {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "missing data" });
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const{ email,password,fcmtokenuser} = req.body   
    console.log(fcmtokenuser)
    if (!email || !password || !fcmtokenuser) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'email and password required' });
    }
    const isUserExists = await isEmailExists(email);
    if (!isUserExists) {
     return res.status(StatusCodes.NOT_FOUND).json({ message: 'user not found' });
    }
    else {
      const token = await loginService(password, isUserExists);
      if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid password' });
      }
      else {
        const fcmtoken = await updatefcmtokenuserService(isUserExists.id, fcmtokenuser);
 
       res.setHeader('authorization', token );
        return res.status(StatusCodes.ACCEPTED).json({ token: token });
       
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while logining' });
  }
}
export const loginadminController = async (req: Request, res: Response) => {
  try {
    const{ email,password} = req.body   
    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'email and password required' });
    }
    const isUserExists = await isEmailExists(email);
    if (!isUserExists) {

     return res.status(StatusCodes.NOT_FOUND).json({ message: 'user not found' });
    }
    else {
      if(isUserExists.role == "admin"){
      const token = await loginService(password, isUserExists);
      
      if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid password' });
      }
      else {
        
       res.setHeader('authorization', token );
        return res.status(StatusCodes.ACCEPTED).json({ token: token });       
      }
    }else {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid access' });
    }
    }
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while logining' });
  }
}
export const resetPasswordofForgetController = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    let decodedToken;
    try {
      decodedToken = jwt.verify(data.token) as IPayload;
    } catch (error) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' })
    }
    const userRecord = await user.findUnique({
      where: { id: decodedToken.id },
    });
    if (decodedToken.type == "reset_password") {
      if (userRecord && userRecord.accesstoken.includes(data.token)) {
        userRecord.accesstoken = [];
        const userReset = await resetPassword(data.password, userRecord);
        return res.status(StatusCodes.ACCEPTED).json({ data: userReset });
      } else {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" })
      }
    }
    else {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized " })
    }
  }
  catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error })
  }
}
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PrismaClient } from '@prisma/client';
import { checkUserSubscription, createtechnicianservice, gettechnicians, getuserbyIdService, isEmailExists } from '../services/userService';
import { createaccountservice } from '../services/authenticationService';


export const createTechnicianController = async (req: Request, res: Response) => {
    try {
      let userdata = req.body;
      if (userdata.email && userdata.password && userdata.phonenumber &&
         userdata.firstname && userdata.lastname) {
            
        const isUserExists = await isEmailExists(userdata.email);
        if (!isUserExists) {
          const technician = await createtechnicianservice(userdata);
          return res.status(StatusCodes.ACCEPTED).json({ status: true, });
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
  export const getTechniciansController = async (req: Request, res: Response) => {
    try {
     
            
        
          const technicians = await gettechnicians();
          return res.status(StatusCodes.ACCEPTED).json({ status: true, technician : technicians });
      
      
    
    } catch (e) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "try again later" });
    }
  };
  export const CheckUserSubscritionController = async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.headers.userid as string, 10);
      const premiumstatus = await checkUserSubscription(userId);
          return res.status(StatusCodes.ACCEPTED).json({ premiumstatus : premiumstatus });
      
      
    
    } catch (e) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "try again later" });
    }
  };
  export const getUserById = async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.headers.userid as string, 10);
      const user = await getuserbyIdService(userId);
          return res.status(StatusCodes.ACCEPTED).json({ user : user });
      
      
    
    } catch (e) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "try again later" });
    }
  };
  
import { StatusCodes } from "http-status-codes";
import { createNotificationService, getnotificationsByuserId } from "../services/notificationService";
import { Request, Response } from 'express';

  export const getnotificationbyuserIdController = async (req: Request, res: Response) => {
    try {
     
        const userId = parseInt(req.headers.userid as string, 10);
        
          const notifs = await getnotificationsByuserId(userId);
          return res.status(StatusCodes.ACCEPTED).json({notifs });
      
      
    
    } catch (e) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "try again later" });
    }
  };
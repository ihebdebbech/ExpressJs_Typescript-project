import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PrismaClient } from '@prisma/client';
import { gettechnicians, isEmailExists } from '../services/userService';
import { createaccountservice } from '../services/authenticationService';
import { createTaskservice, getAlltasks, gettasksbytechinicanId, updateTaskService } from '../services/taskService';


export const createTaskController = async (req: Request, res: Response) => {
    try {
      let task = req.body;
     
          const technician = await createTaskservice(task);
          return res.status(StatusCodes.ACCEPTED).json({ status: true, });
        
       
    } catch (e) {
      console.log(e)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "try again later" });
    }
  };
  export const getTasksController = async (req: Request, res: Response) => {
    try {
     
            
        
          const tasks = await getAlltasks();
          return res.status(StatusCodes.ACCEPTED).json({tasks });
      
      
    
    } catch (e) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "try again later" });
    }
  };
  export const getTasksbytechnicianIdController = async (req: Request, res: Response) => {
    try {
     
        const technicianId = parseInt(req.headers.userid as string, 10);
        
          const tasks = await gettasksbytechinicanId(technicianId);
          return res.status(StatusCodes.ACCEPTED).json({tasks });
      
      
    
    } catch (e) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "try again later" });
    }
  };
  export const completeTaskController = async (req: Request, res: Response) => {
    try {
     
      let {taskid, report} = req.body;
        
          const tasks = await updateTaskService(taskid,report);
          return res.status(StatusCodes.ACCEPTED).json({status : true });
      
      
    
    } catch (e) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status : false });
    }
  };
  
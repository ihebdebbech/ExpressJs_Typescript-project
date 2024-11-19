import express, { Request, Response, NextFunction } from 'express';
import jwt from '../utils/jwt';
import { PrismaClient } from '@prisma/client';
import { createTechnicianController, getTechniciansController } from '../controllers/userController';
import { completeTaskController, createTaskController, getTasksController,getTasksbytechnicianIdController } from '../controllers/TaskController';
import access from '../middleware/access';
import { getnotificationbyuserIdController } from '../controllers/notificationController';



const router = express.Router();
router.get("/getnotifsbyuserid", getnotificationbyuserIdController);


export default router;

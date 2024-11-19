import express, { Request, Response, NextFunction } from 'express';
import jwt from '../utils/jwt';
import { PrismaClient } from '@prisma/client';
import { createTechnicianController, getTechniciansController } from '../controllers/userController';
import { completeTaskController, createTaskController, getTasksController,getTasksbytechnicianIdController } from '../controllers/TaskController';
import access from '../middleware/access';



const router = express.Router();
router.post("/", createTaskController);
router.get("/getalltask",access("admin"), getTasksController);
router.get("/gettasksbytechnicianid", getTasksbytechnicianIdController);
router.put("/completetask", completeTaskController);

export default router;

import express, { Request, Response, NextFunction } from 'express';
import jwt from '../utils/jwt';
import { PrismaClient } from '@prisma/client';
import { createTechnicianController, getTechniciansController,CheckUserSubscritionController, getUserById } from '../controllers/userController';
import access from '../middleware/access';

const router = express.Router();
router.route("/addtechnician").post(access("admin"), createTechnicianController);
router.route("/getalltechnicians",).get(access("admin"), getTechniciansController);
router.route("/getusersubscriptionstatus",).get( CheckUserSubscritionController);
router.route("/getuserdetailsbyid",).get( getUserById);


export default router;
